import express from 'express';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { count, desc } from 'drizzle-orm';
import { db } from './db/index.js';
import { leadExportColumns, leads } from './db/schema.js';
import { chatSchema, leadSchema } from '../shared/apiContracts.js';
import { COMPANY_INFO, PROJECTS, SERVICES, VALUE_PILLARS, SLIDES_DATA } from '../data/portfolioData.js';

dotenv.config();

// Rutas relativas a la raíz del proyecto: en el Worker import.meta.url no está definido.
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const app = express();
app.set('trust proxy', 1);

// Security & DoS Mitigation: Keep JSON bodies small; uploads use a dedicated limit.
app.use(express.json({ limit: '2mb' }));

// Security Headers Middleware (MIME Sniffing & XSS protection, safe for preview iframe)
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy-Report-Only', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' data: https:");
  next();
});


// Rate Limiting Middlewares
// Cada limitador se crea en su primera solicitud: en Cloudflare Workers no se pueden
// iniciar temporizadores (los usa el almacén en memoria) fuera de un handler.
const lazyRateLimit = (options: Parameters<typeof rateLimit>[0]): express.RequestHandler => {
  let limiter: express.RequestHandler | undefined;
  return (req, res, next) => {
    limiter ??= rateLimit(options);
    return limiter(req, res, next);
  };
};

const aiConsultantLimiter = lazyRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25, // limit each IP to 25 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Ha superado el límite de consultas al asesor en este lapso. Por favor, espere unos minutos para continuar.',
  },
});

const estimateLimiter = lazyRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 estimate requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Ha enviado múltiples solicitudes de cotización recientemente. Un gerente se comunicará pronto.',
  },
});

const uploadLimiter = lazyRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

// Intentos con clave de administración por IP; limita la búsqueda de la clave por fuerza bruta.
const adminLimiter = lazyRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Compara resúmenes SHA-256 de igual largo con timingSafeEqual: el tiempo de respuesta
// no revela cuántos caracteres de la clave enviada coinciden.
const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest();
const adminKey = process.env.ADMIN_API_KEY;
const adminKeyDigest = adminKey ? sha256(adminKey) : null;
const isAdminKey = (candidate: string | undefined) =>
  Boolean(adminKeyDigest && candidate && crypto.timingSafeEqual(sha256(candidate), adminKeyDigest));

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!adminKeyDigest) return res.status(503).json({ error: 'La administración no está configurada' });
  if (!isAdminKey(req.header('x-admin-key'))) return res.status(401).json({ error: 'No autorizado' });
  next();
};

const getClientIp = (req: express.Request) => req.ip?.replace(/^::ffff:/, '') ?? null;

// 1. Hardened Save Slide Image Endpoint (Defends against Path Traversal & Arbitrary File Overwrites)
app.post('/api/save-slide-image', uploadLimiter, adminLimiter, requireAdmin, async (req, res) => {
  try {
    const { slideNumber, dataUrl } = req.body;
    if (!slideNumber || !dataUrl) {
      return res.status(400).json({ error: 'slideNumber y dataUrl son requeridos' });
    }

    // Strict numerical validation to prevent directory traversal
    const slideNum = parseInt(String(slideNumber), 10);
    if (isNaN(slideNum) || slideNum < 1 || slideNum > 50) {
      return res.status(400).json({ error: 'slideNumber debe ser un entero válido entre 1 y 50' });
    }

    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Formato de imagen inválido. Debe ser data:image' });
    }

    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Safety check buffer size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido (10MB)' });
    }

    const targetDir = path.resolve(PUBLIC_DIR, 'obras');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Safe isolated file path
    const safeFileName = `slide-${slideNum}.jpg`;
    const filePath = path.resolve(targetDir, safeFileName);

    // Verify path remains strictly inside targetDir
    if (!filePath.startsWith(targetDir)) {
      return res.status(403).json({ error: 'Acceso no autorizado a la ruta destino' });
    }

    fs.writeFileSync(filePath, buffer);
    res.json({ success: true, url: `/obras/${safeFileName}` });
  } catch (error) {
    console.error('Error saving slide image:', error);
    res.status(500).json({ error: 'Error interno al procesar imagen de obra' });
  }
});

// Check existing slide images status
app.get('/api/slides-status', async (req, res) => {
  try {
    const fs = await import('fs');
    const targetDir = path.resolve(PUBLIC_DIR, 'obras');
    const existingSlides: number[] = [];
    if (fs.existsSync(targetDir)) {
      for (let i = 1; i <= 40; i++) {
        if (fs.existsSync(path.join(targetDir, `slide-${i}.jpg`))) {
          existingSlides.push(i);
        }
      }
    }
    res.json({ count: existingSlides.length, slides: existingSlides });
  } catch (error) {
    res.json({ count: 0, slides: [] });
  }
});

// Health & Observability Check Endpoint for Cloud Run / Container Probes
app.get('/api/health', async (_req, res) => {
  const mem = process.memoryUsage();
  try {
    const [{ count: leadsCount }] = await db.select({ count: count(leads.id) }).from(leads);
    return res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      service: 'GARAM Constructores API',
      version: '2026.1.0',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      databaseConfigured: true,
      metrics: { memoryRssMb: Math.round(mem.rss / (1024 * 1024)), memoryHeapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)), persistedLeadsCount: leadsCount },
    });
  } catch {
    return res.status(503).json({ status: 'degraded', databaseConfigured: false });
  }
});

// Commercial Leads Export Endpoint (CSV or JSON)
app.get('/api/leads/export', adminLimiter, requireAdmin, async (req, res) => {
  try {
    const format = req.query.format === 'csv' ? 'csv' : 'json';
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));

    if (format === 'csv') {
      const csvRows = [leadExportColumns.join(',')];
      for (const lead of rows) {
        const row = leadExportColumns.map((column) => {
          const value = lead[column] instanceof Date ? lead[column].toISOString() : lead[column] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(row.join(','));
      }
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="leads-garam-${new Date().toISOString().slice(0, 10)}.csv"`);
      return res.status(200).send(csvRows.join('\n'));
    }

    return res.json({ count: rows.length, leads: rows });
  } catch (err) {
    console.error('Error exporting leads:', err);
    return res.status(500).json({ error: 'Error al exportar prospectos' });
  }
});

// API Endpoints
app.get('/api/portfolio/data', (req, res) => {
  res.json({
    companyInfo: COMPANY_INFO,
    valuePillars: VALUE_PILLARS,
    services: SERVICES,
    projects: PROJECTS,
    slides: SLIDES_DATA,
  });
});


// Gemini AI Architectural Advisor Endpoint (Hardened with Rate Limiting & Error Sanitization)
app.post('/api/chat/consultant', aiConsultantLimiter, async (req, res) => {
  try {
    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'El mensaje no es válido', fields: parsed.error.flatten().fieldErrors });
    }
    const { message, conversationHistory } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'El servicio de asesoría técnica se encuentra temporalmente en mantenimiento.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Eres el Asesor Técnico y Arquitectónico de GARAM Constructores (Portafolio 2026).
Respondes en español con un tono profesional, refinado, técnico y amable, representando la excelencia de la empresa.

INFORMACIÓN CORPORATIVA DE GARAM CONSTRUCTORES:
- Empresa: GARAM Constructores (Promoción, Gerencia y Construcción)
- Lema: "Construimos los espacios donde habita la excelencia." / "Construir con sentido. Construir con GARAM."
- Perfil: Especializados en desarrollo inmobiliario, gerencia integral de proyectos, ingeniería estructural, remodelaciones boutique, urbanismo de alta montaña y construcción médica especializada.
- Áreas de servicio: Promoción, Gerencia de Proyecto, Construcción, Remodelaciones, Urbanismo y Construcción Especializada.
- Cobertura geográfica principal: Caracas (Altamira, La Castellana, El Rosal, La Candelaria, Chacao) y Galipán (Edo. La Guaira).

PORTAFOLIO DE OBRAS DESTACADAS (11 OBRAS):
1. Casa 33 (Altamira, Caracas - 1.321 m²): Residencia ejecutada. Destaca por su volumetría gris, escalera helicoidal exterior en acero naranja, solárium en teca y piscina.
2. Casa AM (Caracas - Parcela 2.476,44 m²): En ejecución. Concreto obra limpia, formas curvas, voladizos pronunciados en armonía con la vegetación.
3. Casa Blanca Galipán (Galipán, La Guaira - Parcela 11.300 m²): En ejecución. Urbanismo de montaña, 6 terrazas conformadas para cabañas ecológicas boutique, muros geotécnicos.
4. Tienda + Restaurante (Altamira, Caracas - 1.250 m²): En ejecución. Edificación vertical de 3 niveles con arcos en mosaico cobalto, estructura metálica y escalera helicoidal en acero.
5. FENDI (La Castellana, Caracas - Parcela 793,29 m²): Ejecutado. Reforma integral de edificio para 3 residencias tipo penthouse con vistas francas al Ávila.
6. Residencias Caroní (Altamira, Caracas - 8 residencias): En ejecución. Obra residencial insignia con profundos voladizos de concreto y jardines colgantes biofílicos.
7. Quinta San Francisco (Altamira, Caracas - 1.914,59 m²): Por ejecutar 2026. Vivienda unifamiliar con área social en doble altura integrada al jardín y piscina.
8. Torre El Rosal — Piso 10 (El Rosal, Caracas - 500 m²): Ejecutado. Habilitación corporativa con techos acústicos cóncavos, panelería en roble y sala de juntas de alta gama.
9. Torre El Rosal — Piso 6 (El Rosal, Caracas - 500 m²): En ejecución. Oficinas estilo industrial moderno con forjados vistos y acabados ejecutivos.
10. Urgencias 9·11 La Candelaria (Caracas - 453,38 m², 4 niveles): Ejecutado. Centro médico especializado con recepción curva en resina epóxica e instalaciones sanitarias normadas.
11. Urgencias 9·11 Torre Europa (El Rosal, Chacao, Caracas - 437,15 m², 2 niveles): Ejecutado. Unidad de atención inmediata en la Av. Francisco de Miranda con doble altura.

Proporciona respuestas claras, estructuradas y detalladas. Si el usuario consulta sobre costos, menciona que GARAM realiza valoraciones personalizadas según metraje, topografía y especificación de acabados, e invítalo a completar el formulario de "Solicitar Cotización".
    `;

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      { role: 'model', parts: [{ text: 'Entendido. Estoy listo para asesorar a los clientes de GARAM Constructores.' }] },
      ...(Array.isArray(conversationHistory) ? conversationHistory.slice(-10) : []).map((item: { role: string; text: string }) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(item.text || '') }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
    });

    const replyText = response.text || 'Disculpe, no pude procesar su consulta en este momento. Por favor intente formularla nuevamente.';

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in Gemini API consultant:', error?.message || error);
    // Secure error response without leaking stack traces or internal auth keys
    res.status(500).json({
      error: 'El asesor técnico está temporalmente indispuesto. Por favor, intente en unos momentos.',
    });
  }
});

// Estimate Request Endpoint with strict validation and atomic Postgres persistence.
app.post('/api/estimate', estimateLimiter, async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Los datos de la solicitud no son válidos; se requiere un canal de contacto válido.', fields: parsed.error.flatten().fieldErrors });
  }

  const referenceId = `GARAM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const inquiry = parsed.data;

  try {
    await db.insert(leads).values({
      referenceId,
      clientIp: getClientIp(req),
      name: inquiry.name,
      email: inquiry.email || null,
      phone: inquiry.phone || null,
      service: inquiry.service,
      area: inquiry.area,
      location: inquiry.location,
      timeline: inquiry.timeline,
      comments: inquiry.comments || null,
    });

    console.log(`[LEAD REGISTRADO] Referencia: ${referenceId}`);
    return res.status(201).json({
      success: true,
      message: 'Solicitud registrada exitosamente. Un gerente de proyectos GARAM se comunicará en breve con su propuesta formal.',
      referenceId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error persisting lead:', error);
    return res.status(500).json({ error: 'No pudimos guardar la solicitud. Intente nuevamente.' });
  }
});

export { app };
