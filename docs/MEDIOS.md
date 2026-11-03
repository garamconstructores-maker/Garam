# Medios de las obras: cómo subir fotos y videos

Este documento explica cómo agregar fotos y videos a la web sin editar código.

## Flujo en 4 pasos

1. **Carpeta por obra.** Dentro de `medios-entrada/` crea una carpeta con el identificador de la obra. Los identificadores están en `src/data/portfolioData.ts` (campo `id`), por ejemplo `casa-am`, `fendi` o `casa-blanca-galipan`.
2. **Nombre de cada archivo.** Usa este formato:

   ```
   NN-tipo-descripcion.ext
   ```

   - `NN`: número de orden en la galería. `00` es la portada de la obra.
   - `tipo`: `render`, `obra`, `interior`, `planta` o `video`.
   - `descripcion`: texto corto con guiones, que se usa como pie de foto.

   Ejemplos:

   | Archivo | Qué hace |
   |---|---|
   | `00-render-fachada.jpg` | Portada de la obra. Aparece en el catálogo. |
   | `01-obra-cimentacion.jpg` | Foto de la etapa "Proceso de obra". |
   | `02-interior-sala.jpg` | Foto de interior. |
   | `03-video-recorrido.mp4` | Video, con imagen de portada generada desde el propio video. |

3. **Procesar.** Desde la carpeta del proyecto, ejecuta:

   ```bash
   node scripts/procesar-medios.mjs
   ```

   El script genera las versiones web, los videos comprimidos y la galería (`src/media/<id>.json`). Si una foto tiene nombre incorrecto o un formato que no reconoce, lo muestra como aviso y la omite.

4. **Revisar y publicar.** Ejecuta `npm run dev`, revisa la ficha de la obra y, si está bien, crea un commit y un pull request, como en las demás ramas.

## Qué se genera

- **Fotos:** versión WebP de 1920 px para la galería. Si la original mide 3000 px o más, también una de 3840 px para el visor ampliado.
- **Videos:** MP4 de hasta 1280 px, optimizado para web, con su imagen de portada.
- **Etapas:** según el tipo, cada foto cae en una etapa de la ficha (`render` → Diseño, `obra` → Proceso de obra, `interior` → Interior, `planta` → Planos, `video` → Recorrido).

## Reglas de calidad

- Fotos horizontales, de 3:2 o más ancho.
- Archivos originales de cámara, no copias de WhatsApp.
- Mínimo 3000 px de ancho para el visor ampliado.
- Videos en formato MP4 o MOV.
- Los originales se quedan en `medios-entrada/` y no se suben a git.

## Videos y el tamaño del repositorio

Los videos comprimidos pesan decenas de megabytes y no deben ir a git. Antes de publicar un video hay que decidir dónde se aloja (por ejemplo, Cloudinary). Mientras tanto, el video se queda en `public/obras/<id>/video/` sin versionar.

## Plan de presentación de la web

1. **Obras destacadas** (ya configuradas): Casa 33, Casa AM, FENDI y Casa Blanca Galipán.
2. **Por obra, en este orden:** portada (`00`), fotos de proceso, interiores y renders, video.
3. **Antes y después:** se activa solo cuando haya dos fotos de la misma vista, tomadas en momentos distintos.
4. **Testimonios:** se agregan cuando haya testimonios reales de clientes.
5. **Obras sin fotos profesionales:** se mantienen en el catálogo sin destacar.
