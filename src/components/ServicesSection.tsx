import React from 'react';
import { SERVICES } from '../data/portfolioData';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './MotionReveal';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
}) => {
  return (
    <section id="servicios" className="py-16 sm:py-24 bg-white border-b border-brand-stone font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-stone pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-semibold text-brand-muted tracking-widest uppercase">
                DISCIPLINAS TÉCNICAS
              </div>
              <h2 className="font-editorial text-4xl font-normal leading-tight tracking-tight text-brand-ink text-balance sm:text-5xl">
                Alcance integral de obra.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-brand-muted max-w-md">
              Desde la factibilidad inmobiliaria y gerencia BIM hasta la ejecución llave en mano. Seleccione una disciplina para iniciar una consulta.
            </p>
          </div>
        </FadeIn>

        {/* Compact Editorial Grid without enumerations */}
        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => (
            <StaggerItem key={service.id}>
              <button
                type="button"
                onClick={() => onSelectServiceForInquiry(service.title)}
                className="group w-full text-left flex h-full flex-col justify-between gap-5 rounded-xl border border-brand-stone bg-brand-paper/40 p-6 sm:p-7 transition-all duration-200 hover:border-brand-ink/40 hover:bg-white cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-brand-ink group-hover:text-brand-copper transition-colors">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-brand-muted group-hover:text-brand-copper transition-colors shrink-0 mt-1.5" />
                  </div>

                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <ul className="pt-3 border-t border-brand-stone/70 text-[11px] leading-snug text-brand-muted space-y-1">
                  {service.scopeItems.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
