// Archivos para buscadores e IA generados desde portfolioData.ts en el build:
// etiquetas del <head> y JSON-LD (dentro de index.html), robots.txt, sitemap.xml y llms.txt.
import { COMPANY_INFO, PROJECTS, SERVICES } from './portfolioData';

/** Dominio de producción: el Worker de Cloudflare sirve www.garam.com.co. */
export const SITE_URL = 'https://www.garam.com.co';
const SITE_NAME = 'GARAM Constructores';

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
          image: `${SITE_URL}${p.heroImage}`,
        })),
      },
    ],
  };
}

/** Canonical y URLs absolutas para redes sociales; las relativas no las leen WhatsApp ni LinkedIn. */
export function buildHeadTags(): string {
  const image = `${SITE_URL}/og-image.jpg`;
  return [
    `<link rel="canonical" href="${SITE_URL}/" />`,
    `<meta property="og:url" content="${SITE_URL}/" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ');
}

export function buildRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
}

export function buildSitemap(lastmod: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${SITE_URL}/</loc><lastmod>${lastmod}</lastmod></url>`,
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
    ...PROJECTS.map((p) => `- **${p.title}** (${p.status}): ${projectSummary(p)}`),
    '',
  ].join('\n');
}
