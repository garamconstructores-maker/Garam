# 0001 · El sitio y la API se despliegan en un Worker de Cloudflare

- **Fecha:** 2026-11-18
- **Estado:** aceptada

## Contexto

El sitio estaba en Vercel (plan Hobby) y el DNS de garam.com.co en Cloudflare. En producción, `/api/health`, `/api/portfolio/data` y `/api/estimate` devolvían 404: Vercel solo publicaba el build estático de Vite y el servidor Express no se desplegaba, así que la cotización, el asesor con IA y la exportación de prospectos no funcionaban. Además, el plan Hobby de Vercel no permite uso comercial.

## Decisión

El sitio y la API se despliegan juntos como un Worker de Cloudflare, con el CLI `cf`:

- `src/worker.ts` monta la aplicación Express de `src/server/app.ts` con `httpServerHandler` (`nodejs_compat`).
- Los assets estáticos los sirve Cloudflare; solo `/api/*` pasa primero por el Worker (`runWorkerFirst` en `cloudflare.config.ts`).
- Express pasa a la versión 5: la 4 usa `new Function` al cargar, y el runtime de Cloudflare no lo permite.
- El proyecto usa npm (`package-lock.json`): `cf` no ejecuta Bun.

Se descartó mantener Vercel: habría que pagar el plan Pro y mantener dos plataformas (DNS en Cloudflare, hosting en Vercel).

## Consecuencias

- Secretos del Worker en producción: `GEMINI_API_KEY` y `ADMIN_API_KEY`. En local van en `.dev.vars` (ver `.dev.vars.example`).
- La base de datos se decidió en [0002](0002-prospectos-en-d1.md): los prospectos se guardan en Cloudflare D1.
- `/api/save-slide-image` escribe en `public/obras/` y no funciona en Workers. Si se necesita, las imágenes deben ir a R2.
- Los límites de tasa viven en la memoria de cada instancia del Worker, así que son aproximados.
- Desde el 2026-11-18, `www.garam.com.co` y `garam.com.co` son dominios del Worker (`domains` en `cloudflare.config.ts`). Una regla de redirección de la zona envía `garam.com.co` a `www.garam.com.co` con 301, conservando ruta y parámetros.
- Para volver a Vercel: quitar los dominios del Worker y recrear los CNAME de `garam.com.co` y `www.garam.com.co` hacia `d177616395cfbbe9.vercel-dns-017.com`, sin proxy.
- Queda pendiente retirar el dominio del proyecto de Vercel.
