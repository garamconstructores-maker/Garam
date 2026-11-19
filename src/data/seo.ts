// Archivos para buscadores e IA generados desde portfolioData.ts en el build:
// etiquetas del <head> y JSON-LD (dentro de index.html), robots.txt, sitemap.xml y llms.txt.
import type { Project } from '../types/portfolio';
import { COMPANY_INFO, PROJECTS, SERVICES } from './portfolioData';
import { projectPath } from './routes';

/** Dominio canónico (docs/decisiones/0003): los demás dominios redirigen aquí con 301. */
export const SITE_URL = 'https://www.garamconstructores.com';
const SITE_NAME = 'GARAM Constructores';
/** Título de la portada; coincide con el <title> de index.html. */
export const HOME_TITLE = 'GARAM Constructores | De la visión a la obra';
const pageUrl = (path: string) => `${SITE_URL}${path}`;

// "GERENCIA DE PROYECTO" → "Gerencia de proyecto"
const sentenceCase = (text: string) => text.charAt(0) + text.slice(1).toLocaleLowerCase('es');

const projectSummary = (p: (typeof PROJECTS)[number]) => `${p.category} en ${p.location}, ${p.area}. ${p.slogan}`;

export function buildJsonLd() {
  const areaServed = [...new Set(PROJECTS.map((p) => p.location))];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ['GARAM', 'GARAM Constructores C.A.'],
        url: SITE_URL,
        logo: `${SITE_URL}/garam-logo.svg`,
        image: `${SITE_URL}/og-image.jpg`,
        description: COMPANY_INFO.profileText,
        address: { '@type': 'PostalAddress', addressLocality: 'Caracas', addressCountry: 'VE' },
        areaServed,
        knowsAbout: SERVICES.map((s) => sentenceCase(s.title)),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Servicios de ${SITE_NAME}`,
          itemListElement: SERVICES.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: sentenceCase(s.title), description: s.description },
          })),
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#portfolio`,
        name: `Portafolio de obras de ${SITE_NAME}`,
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: p.title,
          description: projectSummary(p),
          url: pageUrl(projectPath(p.id)),
          image: `${SITE_URL}${p.heroImage}`,
        })),
      },
    ],
  };
}

/** Canonical y URLs absolutas para redes sociales; las relativas no las leen WhatsApp ni LinkedIn. */
export function buildHeadTags(path = '/', imagePath = '/og-image.jpg'): string {
  const image = pageUrl(imagePath);
  return [
    `<link rel="canonical" href="${pageUrl(path)}" />`,
    `<meta property="og:url" content="${pageUrl(path)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ');
}

/** Título y descripción de la página de una obra (pestaña, buscadores y redes). */
export function projectPageMeta(p: Project): { title: string; description: string } {
  const description = `${p.subtitle} ${projectSummary(p)}`;
  // Google corta los títulos de más de ~65 caracteres: se usa la variante más completa que quepa.
  const zone = p.location.split('·')[0].trim();
  const category = p.category.split('/')[0].trim();
  const candidates = [
    `${p.title} · ${p.category} en ${p.location} | ${SITE_NAME}`,
    `${p.title} · ${category} en ${zone} | ${SITE_NAME}`,
    `${p.title} · ${category} | ${SITE_NAME}`,
    `${p.title} | ${SITE_NAME}`,
  ];
  return {
    title: candidates.find((t) => t.length <= 65) ?? candidates[candidates.length - 1],
    description: description.length > 160 ? `${description.slice(0, 157).trimEnd()}…` : description,
  };
}

export function buildProjectJsonLd(p: Project) {
  const url = pageUrl(projectPath(p.id));
  const meta = projectPageMeta(p);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#pagina`,
        url,
        name: meta.title,
        description: meta.description,
        inLanguage: 'es',
        primaryImageOfPage: pageUrl(p.heroImage),
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: p.title, item: url },
        ],
      },
    ],
  };
}

/** Páginas que el build genera además de la portada: una por obra. */
export const projectPages = () =>
  PROJECTS.map((p) => ({
    id: p.id,
    path: projectPath(p.id),
    image: p.heroImage,
    meta: projectPageMeta(p),
    jsonLd: buildProjectJsonLd(p),
  }));

export function buildRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
}

export function buildSitemap(lastmod: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE_URL}/</loc><lastmod>${lastmod}</lastmod></url>`,
    ...PROJECTS.map((p) => `  <url><loc>${pageUrl(projectPath(p.id))}</loc><lastmod>${lastmod}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

export function buildLlmsTxt(): string {
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${COMPANY_INFO.profileText}`,
    '',
    `Sitio: ${SITE_URL}`,
    '',
    '## Servicios',
    '',
    ...SERVICES.map((s) => `- **${sentenceCase(s.title)}**: ${s.description}`),
    '',
    '## Obras',
    '',
    ...PROJECTS.map((p) => `- [${p.title}](${pageUrl(projectPath(p.id))}) (${p.status}): ${projectSummary(p)}`),
    '',
  ].join('\n');
}
