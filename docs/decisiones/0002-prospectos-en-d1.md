# 0002 · Los prospectos se guardan en Cloudflare D1

- **Fecha:** 2026-11-18
- **Estado:** aceptada

## Contexto

Con el sitio y la API en un Worker de Cloudflare ([0001](0001-api-en-cloudflare-workers.md)), faltaba decidir dónde se guardan los prospectos del formulario de cotización. El código usaba PostgreSQL con un `Pool` de `pg` y, sin `DATABASE_URL`, un archivo local `data/leads.json`. En Workers no hay disco persistente y un `Pool` global no puede reutilizar conexiones entre solicitudes.

## Decisión

Los prospectos se guardan en Cloudflare D1 (SQLite), en la base `garam-leads` de la cuenta de Garam, región este de Norteamérica.

- El Worker accede con el binding `DB` declarado en `cloudflare.config.ts`; no hay cadena de conexión ni secreto.
- Drizzle sigue siendo el ORM, con el dialecto SQLite (`src/server/db/schema.ts`).
- El esquema se versiona como SQL en `migrations/` y se aplica con `npm run db:migrate` (producción) o `npm run db:migrate:local` (desarrollo).

Se descartó PostgreSQL externo (Neon o Supabase) con Hyperdrive: suma un proveedor, una cuenta y un secreto más, y obliga a abrir una conexión por solicitud, sin ventajas para el volumen de prospectos del sitio.

## Consecuencias

- Desaparecen `DATABASE_URL`, `pg` y el respaldo en `data/leads.json`.
- Las fechas se guardan como milisegundos desde 1970 (`INTEGER`); la exportación las entrega en ISO 8601.
- Si había prospectos en la base Neon de la versión anterior del sitio, no se migraron.
- Para consultar los datos: `npx cf d1 query` o la consola de D1 en el panel de Cloudflare. D1 permite volver a un punto anterior con Time Travel (`npx cf d1 time-travel`): 7 días en el plan gratuito de Workers y 30 en el de pago.
