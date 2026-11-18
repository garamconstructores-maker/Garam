import React, { useMemo, useRef, useState } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FadeIn } from './MotionReveal';
import { CoverCarousel } from './CoverCarousel';
import { projectPath } from '../data/routes';

// Portafolio curado: obras que se muestran primero.
const FEATURED_IDS = ['casa-33', 'casa-am', 'fendi', 'casa-blanca-galipan'];

// Pestañas por estatus; "Todas" muestra primero las destacadas.
const STATUS_TABS: { id: string; label: string; status?: Project['status'] }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'construidas', label: 'Construidas', status: 'Ejecutado' },
  { id: 'en-ejecucion', label: 'En ejecución', status: 'En ejecución' },
  { id: 'por-ejecutar', label: 'Por ejecutar', status: 'Por ejecutar' },
];

// Distancia mínima de deslizamiento (px) para pasar de obra en pantallas táctiles.
const SWIPE_THRESHOLD = 60;

const rank = (id: string) => {
  const index = FEATURED_IDS.indexOf(id);
  return index === -1 ? FEATURED_IDS.length : index;
};

const pad = (n: number) => String(n).padStart(2, '0');

interface ProjectsCatalogProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsCatalog: React.FC<ProjectsCatalogProps> = ({ onSelectProject }) => {
  const [tabId, setTabId] = useState('todas');
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const dragged = useRef(false);

  const sorted = useMemo(() => [...PROJECTS].sort((a, b) => rank(a.id) - rank(b.id)), []);
  const counts = useMemo(
    () => Object.fromEntries(STATUS_TABS.map((t) => [t.id, t.status ? sorted.filter((p) => p.status === t.status).length : sorted.length])),
    [sorted],
  );
  const tab = STATUS_TABS.find((t) => t.id === tabId) ?? STATUS_TABS[0];
  const projects = tab.status ? sorted.filter((p) => p.status === tab.status) : sorted;
  const current = projects[Math.min(index, projects.length - 1)];
  const total = projects.length;

  const goTo = (next: number) => {
    if (total === 0) return;
    setDirection(next > index || (index === total - 1 && next === 0) ? 1 : -1);
    setIndex((next + total) % total);
  };
  const changeTab = (id: string) => {
    setTabId(id);
    setIndex(0);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  const slideOffset = reduceMotion ? 0 : 48;

  return (
    <section id="obras" className="py-16 sm:py-24 bg-brand-paper border-b border-brand-stone font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <FadeIn direction="up" distance={24}>
          <div className="flex flex-col gap-6 border-b border-brand-stone pb-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-semibold text-brand-muted tracking-widest uppercase">Portafolio de obras</div>
              <h2 className="font-editorial text-4xl font-normal leading-tight tracking-tight text-brand-ink text-balance sm:text-5xl">
                Obras construidas y en ejecución.
              </h2>
            </div>

            <div role="group" aria-label="Filtrar obras por estatus" className="flex flex-wrap items-center gap-1.5">
              {STATUS_TABS.map((t) => {
                const active = t.id === tabId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => changeTab(t.id)}
                    aria-pressed={active}
                    className={`relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      active ? 'text-white' : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeStatusIndicator"
                        className="absolute inset-0 -z-10 rounded-md bg-brand-ink"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{t.label}</span>
                    <span className={`font-mono tabular-nums ${active ? 'text-white/70' : 'text-brand-muted/70'}`}>{counts[t.id]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {current && (
          <div
            role="region"
            aria-roledescription="carrusel"
            aria-label="Obras de GARAM"
            onKeyDown={onKeyDown}
            className="space-y-5"
          >
            <div className="relative overflow-hidden rounded-xl border border-brand-stone bg-white">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={`${tabId}-${current.id}`}
                  role="group"
                  aria-roledescription="diapositiva"
                  aria-label={`${index + 1} de ${total}: ${current.title}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * slideOffset }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * slideOffset }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragStart={() => {
                    dragged.current = true;
                  }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -SWIPE_THRESHOLD) goTo(index + 1);
                    else if (info.offset.x > SWIPE_THRESHOLD) goTo(index - 1);
                    // El clic que sigue al arrastre no debe abrir la ficha.
                    window.setTimeout(() => (dragged.current = false), 0);
                  }}
                  onClick={() => {
                    if (!dragged.current) onSelectProject(current);
                  }}
                  className="group grid cursor-pointer grid-cols-1 items-stretch lg:grid-cols-12"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 lg:col-span-7 lg:aspect-auto lg:min-h-[460px]">
                    <CoverCarousel
                      project={current}
                      className="absolute inset-0 h-full w-full"
                      loading="eager"
                      sizes="(min-width: 1024px) 58vw, 100vw"
                    />
                    <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-brand-ink shadow-sm">
                      {current.status}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between gap-6 p-7 sm:p-10 lg:col-span-5">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                        <span className="font-medium text-brand-ink">{current.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{current.location}</span>
                      </div>
                      <h3 className="font-editorial text-3xl font-normal tracking-tight text-brand-ink transition-colors group-hover:text-brand-copper sm:text-5xl">
                        {current.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-brand-muted">{current.slogan}</p>
                      <p className="line-clamp-3 text-sm leading-relaxed text-brand-muted/90">{current.memoria}</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-brand-stone pt-4 text-xs">
                      <div className="font-mono font-semibold tabular-nums text-brand-ink">{current.area}</div>
                      {/* Enlace real a la página de la obra: los buscadores lo siguen y con teclado abre la ficha. */}
                      <a
                        href={projectPath(current.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectProject(current);
                        }}
                        aria-label={`Ver ficha técnica de ${current.title}`}
                        className="flex cursor-pointer items-center gap-1 rounded-sm font-semibold text-brand-ink transition-colors group-hover:text-brand-copper"
                      >
                        <span>Ver ficha técnica</span>
                        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Obra anterior"
                disabled={total < 2}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-stone bg-white text-brand-ink transition-colors hover:border-brand-ink disabled:cursor-default disabled:opacity-40"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              </button>

              {/* Índice: un enlace por obra (rastreable y con nombre); en pantalla se ve como puntos. */}
              <nav aria-label="Ir a una obra" className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <ol className="flex flex-wrap items-center justify-center gap-1.5">
                  {projects.map((p, i) => (
                    <li key={p.id}>
                      <a
                        href={projectPath(p.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          goTo(i);
                        }}
                        aria-label={p.title}
                        aria-current={i === index ? 'true' : undefined}
                        title={p.title}
                        className="flex h-6 items-center"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-300 ${
                            i === index ? 'w-6 bg-brand-ink' : 'w-1.5 bg-brand-stone hover:bg-brand-muted'
                          }`}
                        />
                      </a>
                    </li>
                  ))}
                </ol>
                <p aria-live="polite" className="font-mono text-xs tabular-nums text-brand-muted">
                  {pad(index + 1)} / {pad(total)}
                </p>
              </nav>

              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Obra siguiente"
                disabled={total < 2}
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-stone bg-white text-brand-ink transition-colors hover:border-brand-ink disabled:cursor-default disabled:opacity-40"
              >
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
