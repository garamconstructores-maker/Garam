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
| Backend | Express (`server.ts`), express-rate-limit, Zod |
| Datos | PostgreSQL con Drizzle ORM. Respaldo local en `data/leads.json`, solo para desarrollo |
| IA | `@google/genai` (Gemini) |
| Medios | ffmpeg y ffprobe, para procesar fotos y videos (`scripts/procesar-medios.mjs`) |

## Requisitos

- Node.js 22 o superior
- [Bun](https://bun.sh), porque el proyecto usa `bun.lock`. También funciona con npm.
- ffmpeg, solo si vas a procesar fotos o videos nuevos

## Puesta en marcha

```bash
bun install
cp .env.example .env    # completa los valores
bun run dev             # http://localhost:3000
```

### Variables de entorno

| Variable | Obligatoria | Uso |
|---|---|---|
| `GEMINI_API_KEY` | Para el asesor IA | Sin ella, el chat responde que está en mantenimiento. |
| `DATABASE_URL` | En producción | Conexión a PostgreSQL. Si falta, los prospectos se guardan en `data/leads.json`. |
| `ADMIN_API_KEY` | Para administración | Clave de la cabecera `x-admin-key`. Sin ella, los endpoints de administración responden 503. |
| `VITE_WHATSAPP_NUMBER` | Antes de publicar | Número comercial de WhatsApp, solo dígitos y con código de país. |
| `PORT` | No | Puerto del servidor. Por defecto, 3000. |

> `data/leads.json` contiene datos personales de clientes y está excluido de git. No lo subas al repositorio.

## Scripts

| Comando | Qué hace |
|---|---|
| `bun run dev` | Servidor de desarrollo con Vite integrado |
| `bun run build` | Verifica tipos y genera `dist/` |
| `bun run start` | Sirve `dist/` en modo producción |
| `bun run lint` | Verifica tipos con `tsc --noEmit` |
| `bun run test` | Pruebas de la API. Requieren el servidor corriendo en el puerto 3000 |
| `bun run clean` | Elimina `dist/` |

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
server.ts                  Servidor Express y endpoints
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
3. Revisa la ficha de la obra con `bun run dev`.

Los originales y los videos comprimidos no se suben a git. Los videos deben alojarse en un servicio externo antes de publicarse.

## Despliegue

- Compila con `bun run build` y sirve con `bun run start`. Requiere las variables de entorno de producción.
- La imagen para redes sociales es `public/og-image.jpg` (1200 × 630 px).

## Flujo de trabajo

- Trabaja en una rama por tarea y abre un pull request contra `main`.
- Antes de mergear, verifica `bun run lint` y `bun run build`.
