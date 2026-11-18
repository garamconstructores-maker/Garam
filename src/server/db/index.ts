import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { leads } from './schema.ts';

// Base D1 de prospectos, enlazada como DB en cloudflare.config.ts.
export const db = drizzle(env.DB, { schema: { leads } });
