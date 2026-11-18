// Tipos mínimos del módulo del runtime de Cloudflare que usa src/worker.ts.
declare module 'cloudflare:node' {
  export function httpServerHandler(options: { port: number }): {
    fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>;
  };
}
