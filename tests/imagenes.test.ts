// Tope de peso por archivo y variantes responsivas de las fotos de public/obras/ (P-11).
// Si falla al agregar fotos: node scripts/imagenes-responsivas.mjs y volver a comprimir.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { hasVariants, variantUrl, VARIANT_WIDTHS } from '../src/utils/responsiveImage.ts';

const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');
const KB = 1024;
// Lo que descarga el navegador según dónde se muestra la foto.
const MAX_BYTES = { variant640: 200 * KB, variant1280: 400 * KB, web: 1024 * KB, master8k: 3 * 1024 * KB };

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const photos = walk(path.join(PUBLIC_DIR, 'obras'))
  .filter((file) => file.endsWith('.webp'))
  .map((file) => ({ url: '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/'), bytes: fs.statSync(file).size }));

const limitFor = (url: string) =>
  url.endsWith('-640.webp') ? MAX_BYTES.variant640
  : url.endsWith('-1280.webp') ? MAX_BYTES.variant1280
  : url.endsWith('-8k.webp') ? MAX_BYTES.master8k
  : MAX_BYTES.web;

describe('Fotos de las obras', () => {
  test('cada foto web tiene sus variantes de 640 y 1280 px', () => {
    const missing = photos
      .filter((p) => hasVariants(p.url))
      .flatMap((p) => VARIANT_WIDTHS.map((w) => variantUrl(p.url, w)))
      .filter((url) => !fs.existsSync(path.join(PUBLIC_DIR, url)));
    assert.deepEqual(missing, [], 'faltan variantes: ejecuta node scripts/imagenes-responsivas.mjs');
  });

  test('ningún archivo supera su tope de peso', () => {
    const tooHeavy = photos
      .filter((p) => p.bytes > limitFor(p.url))
      .map((p) => `${p.url}: ${Math.round(p.bytes / KB)} KB (tope ${Math.round(limitFor(p.url) / KB)} KB)`);
    assert.deepEqual(tooHeavy, []);
  });
});
