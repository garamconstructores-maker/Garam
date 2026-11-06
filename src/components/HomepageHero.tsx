import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { FadeIn, StaggerContainer, StaggerItem } from './MotionReveal';

interface HomepageHeroProps {
  onOpenPresentation: () => void;
  onOpenInquiry: () => void;
}

const HERO_POSTER = '/obras/casa-33-garam.webp';

const ArchitecturalBlueprint: React.FC = () => (
  <svg
    className="hero-film__blueprint absolute inset-0 size-full text-brand-copper-light"
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
  >
    <g
      className="hero-blueprint__main"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      <path pathLength={1} d="M535 654V408H797V328H1065V408H1196V654H535Z" />
      <path pathLength={1} d="M523 400H808V316H1077V398H1209" />
      <path pathLength={1} d="M797 329L680 390H535" />
      <path pathLength={1} d="M545 655H1202" />
      <path pathLength={1} d="M810 412V653M1074 410V654" />
      <path pathLength={1} d="M569 445H635V552H569ZM652 445H726V552H652Z" />
      <path pathLength={1} d="M847 436H900V506H847ZM921 436H979V506H921Z" />
      <path pathLength={1} d="M844 536H1028V589H844Z" />
      <path pathLength={1} d="M1095 445H1167V549H1095Z" />
    </g>
    <g
      className="hero-blueprint__details"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      opacity="0.72"
    >
      <path pathLength={1} d="M498 373V668M486 373H510M486 668H510M477 373H498M477 668H498" />
      <path pathLength={1} d="M522 694H1209M522 684V704M1209 684V704" />
      <path pathLength={1} d="M531 357H796M531 351V363M796 351V363" />
      <path pathLength={1} d="M1092 315V655M1080 315H1104M1080 655H1104" />
      <path pathLength={1} d="M575 568H631M658 568H721M849 520H1026M1098 562H1163" />
      <path pathLength={1} d="M733 382V398M745 382V398M757 382V398M769 382V398M781 382V398" />
    </g>
  </svg>
);

const HERO_STATS = [
  { value: String(PROJECTS.length), label: 'obras en portafolio' },
  { value: '+25k', label: 'm² construidos' },
  { value: '15+', label: 'años de trayectoria' },
  { value: '2', label: 'ciudades: Caracas y Galipán' },
];

export const HomepageHero: React.FC<HomepageHeroProps> = ({
  onOpenPresentation,
  onOpenInquiry,
}) => (
  <section
    id="inicio"
    aria-labelledby="homepage-hero-title"
    className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-brand-ink text-white sm:min-h-[calc(100svh-5rem)]"
  >
    <div className="hero-film absolute inset-0 z-0 overflow-hidden bg-brand-ink" aria-hidden="true">
      <div className="hero-film__grid absolute inset-0" />
      <img
        src={HERO_POSTER}
        alt=""
        fetchPriority="high"
        loading="eager"
        decoding="async"
        className="hero-film__photo absolute inset-0 size-full object-cover object-[69%_center]"
      />
      <ArchitecturalBlueprint />
      <span className="hero-film__scanner" />
    </div>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-brand-ink/95 via-brand-ink/80 to-brand-ink/30 lg:via-brand-ink/75 lg:to-brand-ink/10"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-brand-ink/85 via-transparent to-brand-ink/30"
    />

    <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-4 pb-6 pt-7 sm:px-6 sm:pb-8 sm:pt-9 lg:px-8 lg:pb-10 lg:pt-10">
      <FadeIn direction="down" distance={14} duration={0.6}>
        <div className="flex items-center justify-end gap-4">
          <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/75 sm:block">
            Caracas <span aria-hidden="true">·</span> Galipán · Venezuela
          </p>
        </div>
      </FadeIn>

      <div className="max-w-3xl py-12 sm:py-16 lg:py-20">
        <FadeIn direction="up" delay={0.05} distance={20}>
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-copper-light sm:text-xs">
              <span aria-hidden="true" className="h-px w-9 bg-brand-copper-light" />
              Promoción · Gerencia · Construcción
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.12} distance={28}>
          <h1
            id="homepage-hero-title"
            className="font-editorial text-5xl font-normal leading-[0.98] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
          >
            De la visión
            <span className="block italic text-brand-copper-light">a la obra.</span>
          </h1>
        </FadeIn>

        <FadeIn direction="up" delay={0.2} distance={24}>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
            Promoción, gerencia y construcción de principio a fin: más de 25 mil m²
            construidos en Caracas y Galipán.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.28} distance={20}>
          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row sm:mt-9">
            <a
              href="#obras"
              onClick={(event) => {
                event.preventDefault();
                onOpenPresentation();
              }}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-brand-copper-light px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-white focus-visible:outline-white whitespace-nowrap"
            >
              <span>Explorar proyectos</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
            <button
              type="button"
              onClick={onOpenInquiry}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/45 bg-brand-ink/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-white whitespace-nowrap cursor-pointer"
            >
              <span>Hablemos de tu proyecto</span>
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </FadeIn>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/25 pt-4 sm:gap-6 sm:pt-5 md:flex-row md:items-end md:justify-between">
        <StaggerContainer
          staggerDelay={0.08}
          delayChildren={0.25}
          className="grid max-w-3xl flex-1 grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-0"
        >
          {HERO_STATS.map((stat) => (
            <StaggerItem
              key={stat.label}
              className="flex flex-col gap-1 sm:border-r sm:border-white/20 sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <dt className="order-2 text-[10px] leading-snug text-white/70 sm:text-xs">
                {stat.label}
              </dt>
              <dd className="order-1 font-editorial text-2xl leading-none text-white tabular-nums sm:text-3xl lg:text-4xl">
                {stat.value}
              </dd>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn direction="up" delay={0.35} distance={16}>
          <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:justify-end">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/65 sm:text-[11px] md:text-right">
              Obra en portada
              <span className="mt-0.5 block font-medium tracking-[0.1em] text-white/95">
                Casa 33 · Altamira, Caracas
              </span>
            </p>
            <a
              href="#obras"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white whitespace-nowrap"
            >
              <span className="hidden sm:inline">Baja para explorar</span>
              <ArrowDown aria-hidden="true" className="size-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default HomepageHero;
