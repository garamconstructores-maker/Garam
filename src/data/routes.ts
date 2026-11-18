// Rutas públicas de las páginas de obra: cada ficha tiene su URL, /proyectos/<id>/.
export const projectPath = (id: string) => `/proyectos/${id}/`;

export const projectIdFromPath = (pathname: string): string | null =>
  pathname.match(/^\/proyectos\/([a-z0-9-]+)\/?$/)?.[1] ?? null;
