// Inserta el HTML renderizado en el index.html que cf build deja para Cloudflare
// y borra el build de servidor. Uso: npm run build (después de cf build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Assets del Worker según la Build Output Specification de cf build.
const ASSETS = path.join(ROOT, '.cloudflare', 'output', 'v1', 'workers', 'default', 'assets');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const PLACEHOLDER = '<div id="root"></div>';

const { render } = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href);
const indexPath = path.join(ASSETS, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');

if (!template.includes(PLACEHOLDER)) {
  console.error(`No se encontró ${PLACEHOLDER} en ${indexPath}`);
  process.exit(1);
}

const appHtml = render();
// Si el HTML no trae el titular principal, el sitio quedaría vacío para buscadores: falla el build.
if (!appHtml.includes("<h1")) {
  console.error("El HTML prerenderizado no contiene <h1>");
  process.exit(1);
}
fs.writeFileSync(indexPath, template.replace(PLACEHOLDER, `<div id="root">${appHtml}</div>`));
fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(`Prerenderizado: ${path.relative(ROOT, indexPath)} (${Math.round(appHtml.length / 1024)} KB de HTML)`);
