# 0003 · Dominio canónico: www.garamconstructores.com

- **Fecha:** 2026-11-18
- **Estado:** aceptada

## Contexto

La web vivía en `www.garam.com.co`. Garam tiene además `garamconstructores.com`, `garamconstructores.org`, `garamconstrucciones.com`, `garamconstrucciones.org` y `garam.lat`, todos en la misma cuenta de Cloudflare. Un sitio con varias direcciones reparte su valor en buscadores, y `.com.co` es el dominio de Colombia, que Google asocia con búsquedas en ese país; la empresa trabaja en Caracas.

## Decisión

La dirección oficial es `https://www.garamconstructores.com`: dominio `.com` sin país y con el nombre de la marca.

- El Worker `garam-web` sirve `www.garamconstructores.com` (y sus otros hostnames, en `cloudflare.config.ts`).
- Cada zona tiene una regla de redirección 301 hacia `https://www.garamconstructores.com`, conservando ruta y parámetros:
  - `garamconstructores.com`
  - `garam.com.co` y `www.garam.com.co`
  - `garamconstructores.org`, `garamconstrucciones.com`, `garamconstrucciones.org` y `garam.lat`, con y sin `www`. Estas zonas tienen registros `AAAA 100::` con proxy, que solo existen para que la regla se aplique.
- Se borraron los registros `A` de `garamconstructores.com` hacia `185.53.179.149` (incluido el comodín `*`): apuntaban a un servidor que respondía 502. Respaldo en el momento del cambio, fuera del repositorio.

## Consecuencias

- El correo no cambia: sigue en `@garam.com.co` (Cloudflare Email Routing, SPF, DKIM, DMARC y Resend intactos).
- `garamconstructores.com` no tiene correo. Si se usa una dirección `@garamconstructores.com` en el sitio, hay que configurarlo.
- Tarjetas, firmas y redes deberían pasar a `garamconstructores.com` con el tiempo; las direcciones viejas siguen redirigiendo.
- Para volver atrás: quitar los dominios nuevos del Worker y cambiar las reglas de redirección de cada zona.
