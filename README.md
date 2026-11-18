# GARAM Constructores

Sitio web y portafolio de **GARAM Constructores**: promoción, gerencia y construcción de espacios residenciales, comerciales, corporativos y especializados en Caracas y Galipán.

El sitio presenta las obras de la empresa, permite solicitar una cotización y responde preguntas básicas con un asesor de IA.

## Funcionalidades

- **Portafolio de 11 obras** con portada rotatoria al pasar el mouse, filtros por categoría y estado, y búsqueda.
- **Ficha de obra** con galería por etapas (diseño, proceso de obra, recorrido) y visor a alta resolución.
- **Solicitud de cotización:** guarda el prospecto y entrega una referencia `GARAM-XXXXXXXX`.
- **Asesor con IA** (Google Gemini) sobre la empresa y sus obras.
- **Botón flotante de WhatsApp** y acceso a secciones de servicios y perfil corporativo.
- **Exportación de prospectos** (CSV o JSON) para administración, protegida por clave.

## Tecnología

| Capa | Herramientas |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Framer Motion, lucide-react |
| Backend | Express (`src/server/app.ts`) en un Worker de Cloudflare, express-rate-limit, Zod |
| Datos | Cloudflare D1 (SQLite) con Drizzle ORM; migraciones en `migrations/` |
| IA | `@google/genai` (Gemini) |
| Medios | ffmpeg y ffprobe, para procesar fotos y videos (`scripts/procesar-medios.mjs`) |

## Requisitos

- Node.js 22 o superior
- ffmpeg, solo si vas a procesar fotos o videos nuevos

## Puesta en marcha

```bash
npm install
cp .env.example .env              # variables públicas del build (VITE_*)
cp .dev.vars.example .dev.vars    # claves del Worker para desarrollo local
npm run dev             # http://localhost:5173
```

### Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `GEMINI_API_KEY` | Para el asesor IA | Sin ella, el chat responde que está en mantenimiento. |
| `ADMIN_API_KEY` | Para administración | Clave de la cabecera `x-admin-key`. Sin ella, los endpoints de administración responden 503. |
| `VITE_WHATSAPP_NUMBER` | Antes de publicar | Número comercial de WhatsApp, solo dígitos y con código de país. |
| `PORT` | No | Puerto del servidor. Por defecto, 3000. |

> La base D1 `garam-leads` guarda datos personales de clientes. En local, `cf dev` usa una copia simulada en `.cloudflare/state/`, excluida de git. Antes de la primera prueba local, ejecuta `npm run db:migrate:local`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Cloudflare (`cf dev`): Vite y el Worker de la API |
| `npm run build` | Verifica tipos, genera el build para Cloudflare en `.cloudflare/output/` y prerenderiza el HTML |
| `npm run deploy` | Ejecuta `npm run build` y despliega ese build (`cf deploy --prebuilt`) |
| `npm run db:migrate:local` | Aplica las migraciones de `migrations/` a la base D1 local |
| `npm run db:migrate` | Aplica las migraciones a la base D1 de producción |
| `npm run lint` | Verifica tipos con `tsc --noEmit` |
| `npm run test` | Pruebas de la API. Requieren `npm run dev` corriendo (o `BASE_URL`) |
| `npm run clean` | Elimina `dist/` |

> Las pruebas crean un prospecto de prueba en la base configurada. Ejecútalas contra una base de desarrollo.

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Estado del servicio y conteo de prospectos |
| GET | `/api/portfolio/data` | Público | Empresa, servicios, obras y láminas |
| POST | `/api/estimate` | Público (10 solicitudes cada 15 min por IP) | Registra una solicitud de cotización |
| POST | `/api/chat/consultant` | Público (25 mensajes cada 10 min por IP) | Asesor de IA |
| GET | `/api/leads/export?format=csv\|json` | `x-admin-key` | Exporta prospectos |
| POST | `/api/save-slide-image` | `x-admin-key` | Sube la imagen de una lámina |
| GET | `/api/slides-status` | Público | Láminas con imagen cargada |

## Estructura del proyecto

```
src/worker.ts              Entrada del Worker de Cloudflare
src/server/app.ts          Aplicación Express y endpoints
cloudflare.config.ts       Configuración del Worker
src/
  App.tsx                  Composición de la página
  components/              Secciones, fichas de obra y widgets
  data/portfolioData.ts    Contenido: empresa, servicios y obras
  server/db/               Conexión y esquema de base de datos
  shared/apiContracts.ts   Validaciones Zod compartidas
  config.ts                Configuración pública (WhatsApp)
public/obras/              Fotografías y videos de las obras
scripts/procesar-medios.mjs  Procesa fotos y videos nuevos
docs/MEDIOS.md             Guía para subir fotos y videos
tests/api.test.ts          Pruebas de la API
```

## Fotos y videos de las obras

Las fotos se publican en WebP: 1920 px de ancho para la web y 3840 px para el visor ampliado (archivos `*-8k.webp`).

Para agregar medios de una obra, sigue la guía en [docs/MEDIOS.md](docs/MEDIOS.md). En resumen:

1. Coloca los originales en `medios-entrada/<id-de-obra>/`, con nombres como `01-obra-cimentacion.jpg`.
2. Ejecuta `node scripts/procesar-medios.mjs`.
3. Revisa la ficha de la obra con `npm run dev`.

Los originales y los videos comprimidos no se suben a git. Los videos deben alojarse en un servicio externo antes de publicarse.

## Despliegue

- El sitio y la API se despliegan como un Worker de Cloudflare con `npm run deploy`. Las claves de producción se cargan como secretos del Worker. Detalles en [docs/decisiones/0001-api-en-cloudflare-workers.md](docs/decisiones/0001-api-en-cloudflare-workers.md) y [docs/decisiones/0002-prospectos-en-d1.md](docs/decisiones/0002-prospectos-en-d1.md).
- La imagen para redes sociales es `public/og-image.jpg` (1200 × 630 px).

## Flujo de trabajo

- Trabaja en una rama por tarea y abre un pull request contra `main`.
- Antes de mergear, verifica `npm run lint` y `npm run build`.
