import React, { useState } from 'react';
import { MessageCircle, PhoneCall, Compass, X, ChevronRight, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildWhatsAppUrl } from '../config';

interface VipConciergeWidgetProps {
  onOpenInquiry: () => void;
  onOpenAiConsultant: () => void;
}

export const VipConciergeWidget: React.FC<VipConciergeWidgetProps> = ({
  onOpenInquiry,
  onOpenAiConsultant,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Pre-configured WhatsApp message for high-net-worth clients
  const defaultWhatsAppText = encodeURIComponent(
    'Hola GARAM Constructores. Me comunico desde su portal web oficial. Deseo consultar especificaciones y disponibilidad para un proyecto de construcción / desarrollo arquitectónico.'
  );
  const whatsAppUrl = buildWhatsAppUrl(defaultWhatsAppText);

  return (
    <aside aria-label="Canal de Atención Directa" className="fixed bottom-4 right-4 z-40 select-none sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="vip-concierge-panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="ios-glass mb-3 w-[calc(100vw-2rem)] max-w-[380px] rounded-xl border border-brand-stone p-5 text-brand-ink shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-brand-stone">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-copper">
                  Atención Ejecutiva · Caracas
                </div>
                <h3 className="font-editorial text-xl font-normal text-brand-ink mt-1">
                  Gerencia de Proyectos GARAM
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Atención directa para propietarios e inversionistas.
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-brand-muted/80 hover:text-brand-ink hover:bg-brand-paper transition-colors cursor-pointer"
                aria-label="Cerrar panel de atención"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Channels */}
            <div className="py-3 space-y-2.5">
              
              {/* WhatsApp Directo */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between p-3 rounded-lg bg-brand-paper hover:bg-white border border-brand-stone transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-brand-ink text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-ink">
                      WhatsApp Directo
                    </div>
                    <div className="text-[11px] text-brand-muted">
                      Comunicación con Ingeniero Residente
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-ink/60 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Request Formal Estimate */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenInquiry();
                }}
                className="w-full group flex items-center justify-between p-3 rounded-lg bg-brand-paper hover:bg-white border border-brand-stone transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-brand-ink text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-ink">
                      Reunión Técnica de Factibilidad
                    </div>
                    <div className="text-[11px] text-brand-muted">
                      Coordinación directa con Dirección de Obra
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-ink/60 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Technical Advisor */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAiConsultant();
                }}
                className="w-full group flex items-center justify-between p-3 rounded-lg bg-white hover:bg-brand-paper border border-brand-stone transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-brand-ink text-white flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-brand-ink">
                      Consultor Técnico de Portafolio
                    </div>
                    <div className="text-[11px] text-brand-muted">
                      Especificaciones, metrajes y memorias de obra
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-ink/60 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

            {/* Trust Footer */}
            <div className="pt-2.5 border-t border-brand-stone flex items-center justify-between text-[10px] text-brand-muted">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-copper" />
                <span>Confidencialidad Garantizada</span>
              </div>
              <div className="flex items-center gap-1 font-mono tabular-nums">
                <Clock className="w-3 h-3" />
                <span>08:00 – 18:00 VET</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating contact button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex size-12 shrink-0 items-center justify-center rounded-md border border-brand-stone bg-brand-ink text-white shadow-md transition-all duration-200 hover:bg-brand-ink/90 active:scale-95 cursor-pointer"
        aria-label={isOpen ? 'Cerrar atención directa' : 'Abrir atención directa'}
        aria-expanded={isOpen}
        aria-controls="vip-concierge-panel"
        title="Atención Directa GARAM"
      >
        <MessageCircle className="size-5" />
      </button>
    </aside>
  );
};
