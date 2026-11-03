# GARAM Constructores — Sitio web

Portafolio de obras y captación de prospectos de **GARAM Constructores** (promoción, gerencia y construcción en Caracas y Galipán).

## Qué incluye

- Catálogo de 11 obras con ficha detallada, galería y visor en alta resolución.
- Secciones de servicios y perfil corporativo.
- Formulario de cotización: guarda el prospecto y devuelve una referencia `GARAM-XXXXXXXX`.
- Asesor con IA (Google Gemini) que responde sobre la empresa y sus obras.
- Botón flotante de WhatsApp.
- API de administración para exportar prospectos (CSV/JSON).

## Tecnología

| Capa | Herramientas |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Framer Motion, lucide-react |
| Backend | Express (`server.ts`), express-rate-limit, Zod |
| Datos | PostgreSQL con Drizzle ORM (respaldo local en `data/leads.json` solo para desarrollo) |
| IA | `@google/genai` (Gemini) |

## Requisitos

- Node.js 22 o superior
- [Bun](https://bun.sh) (el proyecto usa `bun.lock`). Con npm también funciona: `npm install`.

## Puesta en marcha

```bash
bun install
cp .env.example .env   # y completar los valores
bun run dev            # http://localhost:3000
```

### Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `GEMINI_API_KEY` | Para el asesor IA | Sin ella, el chat responde "en mantenimiento". |
| `DATABASE_URL` | En producción | Conexión PostgreSQL. Si falta, los prospectos se guardan en `data/leads.json`. |
| `ADMIN_API_KEY` | Para la administración | Clave de la cabecera `x-admin-key`. Sin ella, los endpoints de administración responden 503. |
| `VITE_WHATSAPP_NUMBER` | Sí, antes de publicar | Número comercial de WhatsApp (solo dígitos, con código de país). |
| `PORT` | No | Puerto del servidor (por defecto 3000). |

> `data/leads.json` contiene datos personales de clientes y está excluido de git. No lo subas al repositorio.

## Scripts

| Comando | Qué hace |
|---|---|
| `bun run dev` | Servidor de desarrollo con Vite integrado |
| `bun run build` | Verifica tipos y genera `dist/` |
| `bun run start` | Sirve `dist/` en modo producción |
| `bun run lint` | Verificación de tipos (`tsc --noEmit`) |
| `bun run test` | Pruebas de la API (requieren el servidor corriendo en el puerto 3000) |
| `bun run clean` | Borra `dist/` |

> Las pruebas crean un prospecto de prueba real en la base configurada. Ejecútalas contra una base de desarrollo.

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Estado del servicio y conteo de prospectos |
| GET | `/api/portfolio/data` | Público | Empresa, servicios, obras y láminas |
| POST | `/api/estimate` | Público (10 / 15 min por IP) | Registra una solicitud de cotización |
| POST | `/api/chat/consultant` | Público (25 / 10 min por IP) | Asesor IA |
| GET | `/api/leads/export?format=csv\|json` | `x-admin-key` | Exporta prospectos |
| POST | `/api/save-slide-image` | `x-admin-key` | Sube la imagen de una lámina |
| GET | `/api/slides-status` | Público | Láminas con imagen cargada |

## Estructura

```
server.ts                 Servidor Express y endpoints
src/
  App.tsx                 Composición de la página
  components/             Secciones, modales y widgets
  data/portfolioData.ts   Contenido: empresa, servicios y obras
  server/db/              Conexión y esquema de base de datos
  shared/apiContracts.ts  Validaciones Zod compartidas
  config.ts               Configuración pública (WhatsApp)
public/obras/             Fotografías de las obras (WebP)
tests/api.test.ts         Pruebas de la API
```

## Imágenes

Las fotos están en WebP: 1920 px de ancho para la web y 3840 px para el visor ampliado (archivos `*-8k.webp`). La imagen para redes sociales es `public/og-image.jpg` (1200×630).

Para agregar una obra, coloca sus fotos en `public/obras/` y regístrala en `src/data/portfolioData.ts`.
