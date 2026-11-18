# 0001 · La API se despliega como función de Vercel

- **Fecha:** 2026-11-18
- **Estado:** aceptada

## Contexto

En producción, `/api/health`, `/api/portfolio/data` y `/api/estimate` devolvían 404. Vercel solo publicaba el build estático de Vite: el servidor Express de `server.ts` no se desplegaba, así que la cotización, el asesor con IA y la exportación de prospectos no funcionaban.

## Decisión

La aplicación Express vive en `src/server/app.ts` y se usa en dos lugares:

- `api/[...slug].ts`: Vercel la publica como una sola función que atiende todas las rutas `/api/*`.
- `server.ts`: en local sigue levantando Vite y el servidor como antes (`bun run dev`).

Se descartó alojar el servidor aparte (Render, Railway, Cloud Run): sumaría otra cuenta, otro despliegue y otro dominio para la API, sin ventajas para el tráfico actual.

## Consecuencias

- En Vercel el disco es de solo lectura. Sin `DATABASE_URL`, `/api/estimate` responde 500 en vez de aceptar la solicitud y perderla.
- Hay que cargar en Vercel, en la cuenta de Garam: `DATABASE_URL`, `GEMINI_API_KEY` y `ADMIN_API_KEY`.
- `/api/save-slide-image` escribe en `public/obras/` y no funciona en Vercel. Si se necesita, las imágenes deben ir a un almacenamiento externo.
- Los límites de tasa se guardan en memoria de cada instancia de la función, así que son aproximados.
