// Renderiza la página en el build para que el HTML inicial ya traiga el contenido.
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';

export function render(): string {
  return renderToString(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
