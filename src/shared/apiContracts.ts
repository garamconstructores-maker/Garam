import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).optional().or(z.literal('')),
  phone: z.string().trim().min(7).max(32).optional().or(z.literal('')),
  service: z.string().trim().min(2).max(120),
  area: z.string().trim().min(1).max(40),
  location: z.string().trim().min(2).max(160),
  timeline: z.string().trim().min(2).max(80),
  comments: z.string().trim().max(2000).optional().default(''),
  // Desde dónde se abrió el formulario: hero, header, ficha:casa-am, servicio:promocion…
  origin: z.string().trim().regex(/^[a-z0-9:_-]{1,80}$/).optional(),
  consent: z.literal(true),
}).refine((value) => Boolean(value.email || value.phone), {
  message: 'Se requiere correo electrónico o teléfono',
  path: ['email'],
});

// Embudo de contacto: solo conteos por día, evento y origen; sin datos personales.
export const FUNNEL_EVENTS = [
  'ficha_abierta',
  'formulario_iniciado',
  'formulario_paso_2',
  'formulario_paso_3',
  'solicitud_enviada',
  'whatsapp_click',
] as const;

export const funnelEventSchema = z.object({
  event: z.enum(FUNNEL_EVENTS),
  origin: z.string().trim().regex(/^[a-z0-9:_-]{1,80}$/).optional(),
});

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string().max(2000),
  })).max(20).default([]),
});

export type LeadPayload = z.infer<typeof leadSchema>;
export type ChatPayload = z.infer<typeof chatSchema>;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];
