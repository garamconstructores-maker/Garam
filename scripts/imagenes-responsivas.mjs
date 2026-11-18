// Genera las variantes responsivas de cada foto web de public/obras/:
//   foto.webp (1920 px) → foto-640.webp y foto-1280.webp
// Las usan las tarjetas y miniaturas vía srcset (src/utils/responsiveImage.ts).
// Uso: node scripts/imagenes-responsivas.mjs   (requiere ffmpeg; solo al agregar fotos)
// Las variantes se versionan en git: el build y la integración continua no usan ffmpeg.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OBRAS = path.join(ROOT, 'public', 'obras');
const WIDTHS = [640, 1280];
// Maestras 8K y variantes ya generadas; ojo: casa-am-01.webp sí es una foto original.
const VARIANT = /-(?:8k|640|1280)\.webp$/i;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const sources = walk(OBRAS).filter((file) => file.endsWith('.webp') && !VARIANT.test(file));
let created = 0;

for (const source of sources) {
  for (const width of WIDTHS) {
    const target = source.replace(/\.webp$/i, `-${width}.webp`);
    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) continue;
    execFileSync(
      'ffmpeg',
      ['-v', 'error', '-y', '-i', source, '-vf', `scale='min(${width},iw)':-2`, '-c:v', 'libwebp', '-quality', '76', target],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    );
    created++;
  }
}

console.log(`${sources.length} fotos revisadas, ${created} variantes nuevas (${WIDTHS.join(' y ')} px).`);
