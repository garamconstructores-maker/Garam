// Renderiza la página en el build para que el HTML inicial ya traiga el contenido,
// y expone los datos que scripts/prerender.mjs valida y convierte en archivos de SEO.
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PROJECTS, SERVICES } from './data/portfolioData';
import { mediaPaths, validateContent } from './data/schema';

export { buildHeadTags, buildJsonLd, buildLlmsTxt, buildRobotsTxt, buildSitemap } from './data/seo';

export function render(): string {
  return renderToString(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export const contentErrors = (): string[] => validateContent(PROJECTS, SERVICES);
export const contentMedia = () => mediaPaths(PROJECTS);
