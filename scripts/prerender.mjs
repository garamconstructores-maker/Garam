// Después de cf build: valida el contenido de portfolioData.ts, inserta el HTML
// renderizado, las etiquetas de SEO y el JSON-LD en el index.html que sube
// Cloudflare, escribe robots.txt, sitemap.xml y llms.txt, y borra el build de
// servidor. Uso: npm run build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Assets del Worker según la Build Output Specification de cf build.
const ASSETS = path.join(ROOT, '.cloudflare', 'output', 'v1', 'workers', 'default', 'assets');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const PUBLIC_DIR = path.join(ROOT, 'public');
const ROOT_PLACEHOLDER = '<div id="root"></div>';
const SEO_HEAD_PLACEHOLDER = '<!--seo-head-->';

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

// 2. HTML prerenderizado, etiquetas de SEO y JSON-LD.
const indexPath = path.join(ASSETS, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
for (const placeholder of [ROOT_PLACEHOLDER, SEO_HEAD_PLACEHOLDER]) {
  if (!template.includes(placeholder)) fail(`No se encontró ${placeholder} en ${indexPath}`);
}

const appHtml = ssr.render();
// Si el HTML no trae el titular principal, el sitio quedaría vacío para buscadores: falla el build.
if (!appHtml.includes('<h1')) fail('El HTML prerenderizado no contiene <h1>');

// "<" escapado para que el texto del JSON nunca pueda cerrar la etiqueta <script>.
const jsonLdScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const escapeAttr = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Cambia título y descripción de la plantilla (pestaña, buscadores y redes sociales).
const withMeta = (html, { title, description }) =>
  html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, `$1${escapeAttr(description)}`)
    .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g, `$1${escapeAttr(title)}`);

const renderPage = (html, { path: pagePath, image, jsonLd, appHtml: body }) =>
  html
    .replace(SEO_HEAD_PLACEHOLDER, `${ssr.buildHeadTags(pagePath, image)}\n    ${jsonLdScript(jsonLd)}`)
    .replace(ROOT_PLACEHOLDER, `<div id="root">${body}</div>`);

fs.writeFileSync(indexPath, renderPage(template, { path: '/', jsonLd: ssr.buildJsonLd(), appHtml }));

// Una página por obra (/proyectos/<id>/index.html), con su ficha abierta en el HTML.
const pages = ssr.projectPages();
for (const page of pages) {
  const pageHtml = ssr.render(page.id);
  if (!pageHtml.includes(page.meta.title.split(' · ')[0])) fail(`La página de ${page.id} no contiene el nombre de la obra`);
  const outDir = path.join(ASSETS, ...page.path.split('/').filter(Boolean));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'index.html'),
    renderPage(withMeta(template, page.meta), { path: page.path, image: page.image, jsonLd: page.jsonLd, appHtml: pageHtml }),
  );
}

// 3. Archivos para buscadores e IA.
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(ASSETS, 'robots.txt'), ssr.buildRobotsTxt());
fs.writeFileSync(path.join(ASSETS, 'sitemap.xml'), ssr.buildSitemap(today));
fs.writeFileSync(path.join(ASSETS, 'llms.txt'), ssr.buildLlmsTxt());

fs.rmSync(SSR_DIR, { recursive: true, force: true });
console.log(
  `Prerenderizado: ${path.relative(ROOT, indexPath)} (${Math.round(appHtml.length / 1024)} KB de HTML), ` +
    `${pages.length} páginas de obra, ${images.length} imágenes verificadas, robots.txt, sitemap.xml y llms.txt`,
);
