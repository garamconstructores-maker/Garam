// Public site configuration, read from VITE_* environment variables at build time.
// The fallback number is a placeholder: set VITE_WHATSAPP_NUMBER in .env before deploying.
const PLACEHOLDER_WHATSAPP_NUMBER = '584141234567';

export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || PLACEHOLDER_WHATSAPP_NUMBER).replace(/\D/g, '');

export const buildWhatsAppUrl = (encodedText: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
