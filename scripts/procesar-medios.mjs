// Procesa los medios de cada obra y genera su galería.
//
// Uso: node scripts/procesar-medios.mjs [carpeta-de-entrada]
//
// Entrada (por defecto medios-entrada/):
//   medios-entrada/<id-de-obra>/<NN>-<tipo>-<descripcion>.<ext>
//   Tipos: render | obra | interior | planta | video
//   Ejemplos:
//     00-render-fachada.jpg     → portada de la obra (el 00 siempre es la portada)
//     01-obra-cimentacion.jpg   → etapa "Proceso de obra"
//     02-video-recorrido.mp4    → video con su imagen de portada
//
// Salida:
//   public/obras/<id>/         versiones WebP (1920 px y 3840 px) y videos MP4
//   src/media/<id>.json        galería generada, que lee src/data/portfolioData.ts

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INPUT = path.resolve(ROOT, process.argv[2] ?? 'medios-entrada');
const PUBLIC_OBRAS = path.join(ROOT, 'public', 'obras');
const MEDIA_OUT = path.join(ROOT, 'src', 'media');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'portfolioData.ts');

const IMAGE_EXT = /\.(jpe?g|png|tiff?|heic|webp)$/i;
const VIDEO_EXT = /\.(mp4|mov|m4v)$/i;

// Etapa que muestra la ficha para cada tipo de medio.
const STAGE_BY_TYPE = {
  render: 'Diseño',
  obra: 'Proceso de obra',
  interior: 'Interior',
  planta: 'Planos',
  video: 'Recorrido',
};
const TYPE_BY_MEDIA = { render: 'render', obra: 'obra', interior: 'interior', planta: 'planta', video: 'video' };

const knownIds = new Set([...fs.readFileSync(DATA_FILE, 'utf8').matchAll(/^\s{4}id: '([^']+)'/gm)].map((m) => m[1]));

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });

const dimensions = (file) => {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', file], { encoding: 'utf8' }).trim();
  const [w, h] = out.split('x').map(Number);
  return { w, h };
};

const prettyCaption = (desc, fallback) => {
  const text = (desc || fallback).replace(/[-_]+/g, ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Convierte "02-obra-cimentacion.jpg" en { order, type, desc }.
const parseName = (file) => {
  const base = path.parse(file).name;
  const m = base.match(/^(\d{1,2})-([a-z]+)(?:-(.+))?$/i);
  if (!m) return null;
  const [, order, rawType, desc] = m;
  const type = TYPE_BY_MEDIA[rawType.toLowerCase()];
  if (!type) return null;
  return { order: Number(order), type, desc: desc ?? '' };
};

const processProject = (id) => {
  const dir = path.join(INPUT, id);
  const outDir = path.join(PUBLIC_OBRAS, id);
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f) || VIDEO_EXT.test(f)).sort();
  const gallery = [];
  let hero;
  const warnings = [];

  for (const file of files) {
    const parsed = parseName(file);
    if (!parsed) {
      warnings.push(`${file}: nombre no válido (usa NN-tipo-descripcion)`);
      continue;
    }
    const slug = `${String(parsed.order).padStart(2, '0')}-${parsed.type}${parsed.desc ? `-${parsed.desc}` : ''}`;
    const src = path.join(dir, file);
    const caption = prettyCaption(parsed.desc, parsed.type);
    const stage = STAGE_BY_TYPE[parsed.type];

    if (VIDEO_EXT.test(file)) {
      const videoDir = path.join(outDir, 'video');
      fs.mkdirSync(videoDir, { recursive: true });
      const mp4 = path.join(videoDir, `${slug}.mp4`);
      const poster = path.join(videoDir, `${slug}-poster.webp`);
      run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', 'scale=min(1280\\,iw):-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
      run('ffmpeg', ['-v', 'error', '-y', '-ss', '3', '-i', src, '-frames:v', '1', '-vf', 'scale=720:-2', '-c:v', 'libwebp', '-quality', '80', poster]);
      const webUrl = `/obras/${id}/video/${slug}-poster.webp`;
      gallery.push({ type: 'video', url: webUrl, videoUrl: `/obras/${id}/video/${slug}.mp4`, caption, stage });
      continue;
    }

    const { w } = dimensions(src);
    const webOut = path.join(outDir, `${slug}.webp`);
    run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', 'scale=1920:-2', '-c:v', 'libwebp', '-quality', '80', webOut]);
    const item = { type: parsed.type, url: `/obras/${id}/${slug}.webp`, caption, stage };
    if (w >= 3000) {
      const eightK = path.join(outDir, `${slug}-8k.webp`);
      run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-vf', "scale='min(3840,iw)':-2", '-c:v', 'libwebp', '-quality', '82', eightK]);
      item.master8kUrl = `/obras/${id}/${slug}-8k.webp`;
    } else {
      warnings.push(`${file}: ${w} px de ancho; el visor ampliado usará la versión de 1920 px`);
    }
    if (parsed.order === 0 && !hero) hero = item.url;
    gallery.push(item);
  }

  if (!gallery.length) {
    console.log(`  ${id}: sin medios válidos`);
    return;
  }
  fs.mkdirSync(MEDIA_OUT, { recursive: true });
  fs.writeFileSync(path.join(MEDIA_OUT, `${id}.json`), JSON.stringify({ hero, gallery }, null, 2) + '\n');
  console.log(`  ${id}: ${gallery.length} medios${knownIds.has(id) ? '' : '  [id no existe en portfolioData.ts]'}`);
  warnings.forEach((w) => console.log(`    aviso: ${w}`));
};

if (!fs.existsSync(INPUT)) {
  console.error(`No existe la carpeta de entrada: ${INPUT}`);
  process.exit(1);
}

console.log(`Procesando ${INPUT}`);
for (const id of fs.readdirSync(INPUT).sort()) {
  if (fs.statSync(path.join(INPUT, id)).isDirectory()) processProject(id);
}
