// Levanta cf dev para las pruebas con una base D1 local temporal y claves de prueba,
// y lo apaga al terminar. Así `npm test` no depende de un servidor ya encendido.
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const D1_ID = 'b453f836-8bd6-4031-a2e1-57be9db6e27b';
const STARTUP_TIMEOUT_MS = 120_000;
// Modo de Vite de las pruebas: cf dev lee las claves de .dev.vars.pruebas, que tiene
// prioridad sobre el .dev.vars de desarrollo (ver startTestServer).
const TEST_MODE = 'pruebas';
const TEST_VARS_FILE = path.join(ROOT, `.dev.vars.${TEST_MODE}`);
export const TEST_ADMIN_KEY = 'clave-admin-de-prueba';

export interface TestServer {
  baseUrl: string;
  stop(): Promise<void>;
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
  });

const killTree = (child: ChildProcess) => {
  if (child.pid === undefined || child.exitCode !== null) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F']);
  else process.kill(-child.pid, 'SIGTERM');
};

async function waitForHealth(baseUrl: string, child: ChildProcess, output: () => string) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`cf dev terminó antes de arrancar:\n${output()}`);
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.ok) return;
    } catch {
      // Todavía no escucha.
    }
    await new Promise((r) => setTimeout(r, 1_000));
  }
  throw new Error(`cf dev no respondió en ${STARTUP_TIMEOUT_MS / 1000} s:\n${output()}`);
}

export async function startTestServer(): Promise<TestServer> {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'garam-pruebas-'));
  // GARAM_STATE_DIR lo lee vite.config.ts para que cf dev use esta base temporal.
  const env = { ...process.env, GARAM_STATE_DIR: stateDir };
  fs.writeFileSync(TEST_VARS_FILE, `GEMINI_API_KEY=""
ADMIN_API_KEY="${TEST_ADMIN_KEY}"
`);

  const migration = spawnSync(
    npx,
    ['cf', 'd1', 'migrations', 'apply', D1_ID, '--local', '--persist-to', stateDir],
    { cwd: ROOT, env, encoding: 'utf8', shell: process.platform === 'win32' },
  );
  if (migration.status !== 0) {
    throw new Error(`No se pudo migrar la base de prueba:\n${migration.stdout}\n${migration.stderr}`);
  }

  const port = await freePort();
  const baseUrl = `http://localhost:${port}`;
  let log = '';
  const child = spawn(npx, ['cf', 'dev', '--', '--mode', TEST_MODE, '--port', String(port), '--strictPort'], {
    cwd: ROOT,
    env,
    shell: process.platform === 'win32',
    detached: process.platform !== 'win32',
  });
  child.stdout?.on('data', (chunk) => (log += chunk));
  child.stderr?.on('data', (chunk) => (log += chunk));

  try {
    await waitForHealth(baseUrl, child, () => log.slice(-4_000));
  } catch (error) {
    killTree(child);
    fs.rmSync(stateDir, { recursive: true, force: true });
    fs.rmSync(TEST_VARS_FILE, { force: true });
    throw error;
  }

  return {
    baseUrl,
    async stop() {
      killTree(child);
      await new Promise((r) => setTimeout(r, 500));
      fs.rmSync(stateDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
      fs.rmSync(TEST_VARS_FILE, { force: true });
    },
  };
}
