import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { projectIdFromPath } from './data/routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <ErrorBoundary>
    <App initialProjectId={projectIdFromPath(window.location.pathname)} />
  </ErrorBoundary>
);

// El build trae el HTML prerenderizado (scripts/prerender.mjs); en desarrollo el contenedor llega vacío.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

