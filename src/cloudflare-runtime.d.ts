// Tipos mínimos de los módulos del runtime de Cloudflare que usa el Worker.
declare module 'cloudflare:node' {
  export function httpServerHandler(options: { port: number }): {
    fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>;
  };
}

declare module 'cloudflare:workers' {
  // Bindings declarados en cloudflare.config.ts.
  export const env: {
    DB: Parameters<typeof import('drizzle-orm/d1').drizzle>[0];
    GEMINI_API_KEY?: string;
    ADMIN_API_KEY?: string;
  };
}
