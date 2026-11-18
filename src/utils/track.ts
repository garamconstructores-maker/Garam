// Embudo de contacto: suma 1 a un evento en /api/eventos. Sin datos personales:
// solo el nombre del evento y desde dónde ocurrió. Si falla, no afecta al visitante.
import type { FunnelEvent } from '../shared/apiContracts';

export function track(event: FunnelEvent, origin?: string) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify(origin ? { event, origin } : { event });
  try {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon?.('/api/eventos', blob)) return;
    void fetch('/api/eventos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch {
    // La medición nunca debe romper la página.
  }
}

/** "GERENCIA DE PROYECTO" → "gerencia-de-proyecto", para usarlo como origen. */
export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
