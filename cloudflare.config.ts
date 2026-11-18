import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "garam-web",
    compatibilityDate: "2026-09-21",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/worker.ts",
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
      DATABASE_URL: bindings.secret(),
    },
  },
});
