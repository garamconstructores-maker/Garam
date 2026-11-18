import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tabla de prospectos en D1 (SQLite). La migración vive en migrations/.
export const leads = sqliteTable('leads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  referenceId: text('reference_id').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  clientIp: text('client_ip'),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  service: text('service').notNull(),
  area: text('area').notNull(),
  location: text('location').notNull(),
  timeline: text('timeline').notNull(),
  comments: text('comments'),
  status: text('status').notNull().default('new'),
  consentAt: integer('consent_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export const leadExportColumns = [
  'referenceId',
  'createdAt',
  'name',
  'email',
  'phone',
  'service',
  'area',
  'location',
  'timeline',
  'comments',
] as const;

export type LeadExportColumn = (typeof leadExportColumns)[number];
