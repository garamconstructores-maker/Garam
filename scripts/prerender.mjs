// Después de cf build: valida el contenido de portfolioData.ts, inserta el HTML
// renderizado y el JSON-LD en el index.html que sube Cloudflare, escribe
// sitemap.xml y llms.txt, y borra el build de servidor. Uso: npm run build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Assets del Worker según la Build Output Specification de cf build.
const ASSETS = path.join(ROOT, '.cloudflare', 'output', 'v1', 'workers', 'default', 'assets');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ROOT_PLACEHOLDER = '<div id="root"></div>';
const JSON_LD_PLACEHOLDER = '<!--json-ld-->';

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const ssr = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href);

// 1. Contenido: esquema Zod y archivos referenciados.
const errors = ssr.contentErrors();
const { images, videos } = ssr.contentMedia();
const missing = (paths) => paths.filter((p) => !fs.existsSync(path.join(PUBLIC_DIR, p)));
errors.push(...missing(images).map((p) => `Imagen inexistente en public/: ${p}`));
if (errors.length) fail(`El contenido de portfolioData.ts no es válido:\n- ${errors.join('\n- ')}`);
// Los videos se alojan fuera de git, así que su ausencia solo se avisa.
for (const p of missing(videos)) console.warn(`Aviso: video inexistente en public/: ${p}`);

// 2. HTML prerenderizado y JSON-LD.
const indexPath = path.join(ASSETS, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
for (const placeholder of [ROOT_PLACEHOLDER, JSON_LD_PLACEHOLDER]) {
  if (!template.includes(placeholder)) fail(`No se encontró ${placeholder} en ${indexPath}`);
}

const appHtml = ssr.render();
// Si el HTML no trae el titular principal, el sitio quedaría vacío para buscadores: falla el build.
if (!appHtml.includes('<h1')) fail('El HTML prerenderizado no contiene <h1>');

// "<" escapado para que el texto del JSON nunca pueda cerrar la etiqueta <script>.
const jsonLd = JSON.stringify(ssr.buildJsonLd()).replace(/</g, '\\u003c');
fs.writeFileSync(
  indexPath,
  template
    .replace(JSON_LD_PLACEHOLDER, `<script type="application/ld+json">${jsonLd}</script>`)
    .replace(ROOT_PLACEHOLDER, `<div id="root">${appHtml}</div>`),
);

// 3. Archivos para buscadores e IA.
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ASSETS, 'sitemap.xml'), ssr.buildSitemap(today));
fs.writeFileSync(path.join(ASSETS, 'llms.txt'), ssr.buildLlmsTxt());

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(
  `Prerenderizado: ${path.relative(ROOT, indexPath)} (${Math.round(appHtml.length / 1024)} KB de HTML), ` +
    `${images.length} imágenes verificadas, sitemap.xml y llms.txt`,
);
