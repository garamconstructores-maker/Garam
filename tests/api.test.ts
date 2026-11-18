import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, TEST_ADMIN_KEY, type TestServer } from './servidor-prueba.ts';

// Sin BASE_URL, las pruebas levantan su propio cf dev con una base D1 temporal.
// Con BASE_URL (por ejemplo, la URL publicada) se prueban contra ese servidor.
let BASE_URL = process.env.BASE_URL ?? '';
const ADMIN_KEY = process.env.BASE_URL ? (process.env.ADMIN_API_KEY ?? '') : TEST_ADMIN_KEY;
let server: TestServer | undefined;

before(async () => {
  if (BASE_URL) return;
  server = await startTestServer();
  BASE_URL = server.baseUrl;
}, { timeout: 180_000 });

after(async () => {
  await server?.stop();
});

describe('GARAM Constructores - API & Security Hardening Tests', () => {

  test('GET /api/health should return status healthy and server metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.equal(data.service, 'GARAM Constructores API');
    assert.ok(typeof data.uptimeSeconds === 'number');
    assert.ok(typeof data.metrics?.memoryRssMb === 'number');
    assert.ok(typeof data.metrics?.persistedLeadsCount === 'number');
  });

  test('HTTP Response Headers must contain security headers', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.ok(res.headers.get('strict-transport-security'));
    assert.ok(res.headers.get('permissions-policy'));
    assert.ok(res.headers.get('content-security-policy-report-only'));
  });

  test('GET /api/portfolio/data must return all 11 curated projects', async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/data`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.ok(Array.isArray(data.projects));
    assert.equal(data.projects.length, 11);
    
    // Check Project 01 (Casa 33) and Project 02 (Casa AM)
    const casa33 = data.projects.find((p: any) => p.id === 'casa-33');
    const casaAm = data.projects.find((p: any) => p.id === 'casa-am');

    assert.ok(casa33, 'Casa 33 must exist');
    assert.ok(casaAm, 'Casa AM must exist');
    assert.equal(casaAm.number, '02');
    assert.ok(casaAm.gallery.length >= 4, 'Casa AM must have photos in gallery');
  });

  test('POST /api/estimate must reject requests without contact info', async () => {
    const res = await fetch(`${BASE_URL}/api/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sin Contacto' }),
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error.includes('canal de contacto') || data.error.includes('datos de la solicitud'));
  });

  test('POST /api/estimate should register valid inquiry with reference ticket', async () => {
    const res = await fetch(`${BASE_URL}/api/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arq. Valentina Mendoza',
        email: 'vmendoza@estudio-vm.com',
        phone: '+584120001122',
        service: 'Construcción Residencial de Lujo',
        area: '1.500 m²',
        location: 'La Castellana',
        timeline: '6 meses',
        consent: true,
      }),
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.referenceId.startsWith('GARAM-'));
  });

  test('GET /api/leads/export must reject unauthenticated access', async () => {
    const res = await fetch(`${BASE_URL}/api/leads/export?format=json`);
    assert.ok([401, 503].includes(res.status));
  });

  test('POST /api/save-slide-image must reject unauthenticated access', async () => {
    const res = await fetch(`${BASE_URL}/api/save-slide-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slideNumber: 1, dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' }),
    });
    assert.ok([401, 503].includes(res.status));
  });

  test('POST /api/save-slide-image must block path traversal attempts', async () => {
    const res = await fetch(`${BASE_URL}/api/save-slide-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
      body: JSON.stringify({
        slideNumber: '../../etc/passwd',
        dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==',
      }),
    });

    assert.ok([400, 401, 503].includes(res.status));
    if (res.status === 400) {
      const data = await res.json();
      assert.ok(data.error.includes('entero válido'));
    }
  });

  test('GET /api/leads/export returns the registered leads with the admin key', { skip: !ADMIN_KEY }, async () => {
    const jsonRes = await fetch(`${BASE_URL}/api/leads/export?format=json`, { headers: { 'x-admin-key': ADMIN_KEY } });
    assert.equal(jsonRes.status, 200);
    const data = await jsonRes.json();
    assert.ok(data.leads.some((lead: any) => lead.name === 'Arq. Valentina Mendoza'));

    const csvRes = await fetch(`${BASE_URL}/api/leads/export?format=csv`, { headers: { 'x-admin-key': ADMIN_KEY } });
    assert.equal(csvRes.status, 200);
    assert.ok((await csvRes.text()).startsWith('referenceId,createdAt,name'));
  });

  test('GET /api/leads/export must remain protected for both formats', async () => {
    const jsonRes = await fetch(`${BASE_URL}/api/leads/export?format=json`);
    const csvRes = await fetch(`${BASE_URL}/api/leads/export?format=csv`);
    assert.ok([401, 503].includes(jsonRes.status));
    assert.ok([401, 503].includes(csvRes.status));
  });
});
