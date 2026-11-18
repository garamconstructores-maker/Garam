// Esquemas Zod del contenido del sitio. El build los aplica a portfolioData.ts
// (scripts/prerender.mjs) y falla si una obra o un servicio no cumple.
import { z } from 'zod';
import type { Project, ProjectMedia, ServiceItem } from '../types/portfolio';

const publicPath = z.string().startsWith('/', 'debe ser una ruta pública que empiece con /');

export const projectMediaSchema = z.object({
  type: z.enum(['render', 'obra', 'antes_despues', 'planta', 'interior', 'video']),
  url: publicPath,
  master8kUrl: publicPath.optional(),
  resolution: z.string().optional(),
  caption: z.string().min(1),
  beforeUrl: publicPath.optional(),
  afterUrl: publicPath.optional(),
  stage: z.string().optional(),
  videoUrl: publicPath.optional(),
}) satisfies z.ZodType<ProjectMedia>;

export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'solo minúsculas, números y guiones'),
  number: z.string().regex(/^\d{2}$/, 'dos dígitos, por ejemplo 01'),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  category: z.enum(['Residencial', 'Comercial', 'Corporativo', 'Salud / Especializada', 'Urbanismo']),
  location: z.string().min(1),
  area: z.string().min(1),
  parcelArea: z.string().optional(),
  levels: z.string().optional(),
  status: z.enum(['Ejecutado', 'En ejecución', 'Por ejecutar']),
  statusYear: z.string().optional(),
  heroImage: publicPath,
  heroImage8k: publicPath.optional(),
  has8kMasters: z.boolean().optional(),
  slogan: z.string().min(1),
  memoria: z.string().min(1),
  engineeringChallenge: z.string().optional(),
  keyFeatures: z.array(z.string().min(1)),
  materials: z.array(z.string().min(1)),
  detailedMaterials: z.array(z.object({ name: z.string(), spec: z.string(), application: z.string() })).optional(),
  gallery: z.array(projectMediaSchema).min(1, 'la galería necesita al menos una foto'),
}) satisfies z.ZodType<Project>;

export const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  number: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  description: z.string().min(1),
  scopeItems: z.array(z.string().min(1)).min(1),
  iconName: z.string().min(1),
}) satisfies z.ZodType<ServiceItem>;

const uniqueBy = <T,>(items: T[], key: (item: T) => string, label: string): string[] => {
  const seen = new Set<string>();
  return items.flatMap((item) => {
    const value = key(item);
    if (seen.has(value)) return [`${label} repetido: ${value}`];
    seen.add(value);
    return [];
  });
};

/** Devuelve la lista de errores del contenido; vacía si todo es válido. */
export function validateContent(projects: unknown[], services: unknown[]): string[] {
  const errors: string[] = [];
  const check = (schema: z.ZodType, items: unknown[], label: string) =>
    items.forEach((item, index) => {
      const result = schema.safeParse(item);
      if (!result.success) {
        const id = (item as { id?: string })?.id ?? `#${index + 1}`;
        for (const issue of result.error.issues) {
          errors.push(`${label} ${id} → ${issue.path.join('.') || '(raíz)'}: ${issue.message}`);
        }
      }
    });
  check(projectSchema, projects, 'Obra');
  check(serviceSchema, services, 'Servicio');
  errors.push(...uniqueBy(projects as Project[], (p) => p.id, 'id de obra'));
  errors.push(...uniqueBy(projects as Project[], (p) => p.number, 'número de obra'));
  errors.push(...uniqueBy(services as ServiceItem[], (s) => s.id, 'id de servicio'));
  return errors;
}

/** Rutas de imágenes y videos que deben existir en public/. */
export function mediaPaths(projects: Project[]): { images: string[]; videos: string[] } {
  const images = new Set<string>();
  const videos = new Set<string>();
  for (const p of projects) {
    images.add(p.heroImage);
    if (p.heroImage8k) images.add(p.heroImage8k);
    for (const m of p.gallery) {
      for (const url of [m.url, m.master8kUrl, m.beforeUrl, m.afterUrl]) if (url) images.add(url);
      if (m.videoUrl) videos.add(m.videoUrl);
    }
  }
  return { images: [...images], videos: [...videos] };
}
