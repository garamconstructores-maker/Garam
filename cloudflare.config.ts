import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "garam-web",
    compatibilityDate: "2026-09-21",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/worker.ts",
    // Dominio canónico: www.garamconstructores.com. Los demás hostnames existen para que las
    // reglas de redirección de cada zona los envíen con 301 al canónico (ver docs/decisiones/0003).
    domains: ["www.garamconstructores.com", "garamconstructores.com", "www.garam.com.co", "garam.com.co"],
    observability: {
      enabled: true,
    },
    assets: {
      notFoundHandling: "single-page-application",
      runWorkerFirst: ["/api/*"],
    },
    env: {
      GEMINI_API_KEY: bindings.secret(),
      ADMIN_API_KEY: bindings.secret(),
      // Base D1 de prospectos; migraciones en migrations/.
      DB: bindings.d1({ id: "b453f836-8bd6-4031-a2e1-57be9db6e27b", name: "garam-leads" }),
    },
  },
});
