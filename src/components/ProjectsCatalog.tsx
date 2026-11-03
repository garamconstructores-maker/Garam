import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { handleImageError } from '../utils/imageFallback';
import {
  Search,
  ArrowUpRight,
  Maximize2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from './MotionReveal';
import { CoverCarousel } from './CoverCarousel';

// Portafolio curado: obras que se muestran primero en el catálogo.
const FEATURED_IDS = ['casa-33', 'casa-am', 'fendi', 'casa-blanca-galipan'];

interface ProjectsCatalogProps {
  onSelectProject: (project: Project) => void;
}

export const ProjectsCatalog: React.FC<ProjectsCatalogProps> = ({
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: string[] = [
    'Todos',
    'Residencial',
    'Comercial',
    'Corporativo',
    'Salud / Especializada',
    'Urbanismo',
  ];

  const filteredProjects = useMemo(() => {
    const filtered = PROJECTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slogan.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    // Obras destacadas primero, en el orden definido; el resto conserva su orden.
    const rank = (id: string) => {
      const index = FEATURED_IDS.indexOf(id);
      return index === -1 ? FEATURED_IDS.length : index;
    };
    return [...filtered].sort((a, b) => rank(a.id) - rank(b.id));
  }, [selectedCategory, searchQuery]);

  return (
    <section id="obras" className="py-16 sm:py-24 bg-brand-paper border-b border-brand-stone font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header + Single-Row Filter Bar */}
        <FadeIn direction="up" distance={24}>
          <div className="space-y-6 border-b border-brand-stone pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="text-xs font-semibold text-brand-muted tracking-widest uppercase">
                  PORTAFOLIO DE OBRAS
                </div>
                <h2 className="font-editorial text-4xl font-normal leading-tight tracking-tight text-brand-ink text-balance sm:text-5xl">
                  Arquitectura construida.
                </h2>
              </div>

              {/* Compact Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted/80" />
                <input
                  type="search"
                  aria-label="Buscar obras por nombre o ubicación"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar obra o ubicación..."
                  className="w-full pl-9 pr-8 py-2 bg-white rounded-md border border-brand-stone text-xs text-brand-ink placeholder:text-brand-muted/80 focus:outline-none focus:border-brand-ink transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink p-0.5 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Single-Row Category Tabs */}
            <div
              role="group"
              aria-label="Filtrar por categoría"
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
            >
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isActive}
                    className={`relative px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer z-10 ${
                      isActive ? 'text-white' : 'text-brand-muted hover:text-brand-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 bg-brand-ink rounded-md -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Editorial Projects Grid with Per-Card Intersection Observer Animations */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center bg-white rounded-xl border border-brand-stone space-y-4"
            >
              <p className="text-sm text-brand-muted">
                No se encontraron obras con ese criterio.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-md bg-brand-ink text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Ver todas las obras
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Featured Project with Viewport Scroll Reveal */}
              {filteredProjects.length > 0 && (() => {
                const flagship = filteredProjects[0];

                return (
                  <FadeIn direction="up" distance={32} duration={0.75} amount={0.12}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => onSelectProject(flagship)}
                      className="group bg-white rounded-xl border border-brand-stone overflow-hidden hover:border-brand-ink/30 transition-all cursor-pointer"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        
                        {/* Left: Uninterrupted Main Photograph */}
                        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[400px] bg-slate-900 overflow-hidden">
                          <CoverCarousel project={flagship} className="absolute inset-0 w-full h-full" loading="eager" />

                          <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                            <div className="px-4 py-2 bg-white text-brand-ink text-xs font-semibold rounded-md shadow-lg flex items-center gap-2">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Abrir Ficha y Galería</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Concise Editorial Overview */}
                        <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between space-y-6">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                              <span className="font-medium text-brand-ink">{flagship.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>{flagship.location}</span>
                            </div>

                            <h3 className="font-editorial text-3xl sm:text-5xl font-normal tracking-tight text-brand-ink group-hover:text-brand-copper transition-colors">
                              {flagship.title}
                            </h3>

                            <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
                              {flagship.slogan}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-brand-stone flex items-center justify-between text-xs">
                            <div className="font-mono tabular-nums text-brand-ink font-semibold">
                              {flagship.area}
                            </div>
                            <span className="font-semibold text-brand-ink group-hover:text-brand-copper transition-colors flex items-center gap-1">
                              <span>Ver Ficha Técnica</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })()}

              {/* Secondary Projects Grid with Individual Intersection Observer Stagger */}
              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProjects.slice(1).map((project, idx) => (
                    <FadeIn
                      key={project.id}
                      direction="up"
                      distance={28}
                      duration={0.65}
                      delay={(idx % 3) * 0.08}
                      amount={0.12}
                      className="h-full"
                    >
                      <motion.div
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="group bg-white rounded-xl border border-brand-stone hover:border-brand-ink/30 overflow-hidden flex flex-col justify-between h-full cursor-pointer transition-all"
                        onClick={() => onSelectProject(project)}
                      >
                        <div>
                          {/* Clean Photography */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                            <CoverCarousel project={project} className="absolute inset-0 w-full h-full" />

                            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-white/90 text-brand-ink text-[11px] font-semibold tracking-wide shadow-sm pointer-events-none">
                              {project.status}
                            </span>

                            <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                              <div className="px-3.5 py-1.5 bg-white text-brand-ink text-xs font-semibold rounded-md shadow-lg flex items-center gap-1.5">
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Ver Obra</span>
                              </div>
                            </div>
                          </div>

                          {/* Minimalist Editorial Card Copy */}
                          <div className="p-6 space-y-2.5">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-brand-muted">
                              <span className="font-medium text-brand-ink">{project.category}</span>
                              <span aria-hidden="true">·</span>
                              <span>{project.location}</span>
                            </div>

                            <h3 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight text-brand-ink group-hover:text-brand-copper transition-colors">
                              {project.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-brand-muted line-clamp-2 leading-relaxed">
                              {project.slogan}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-5 pt-3 border-t border-brand-stone/70 flex items-center justify-between text-xs">
                          <span className="font-mono tabular-nums text-brand-muted">
                            {project.area}
                          </span>
                          <span className="font-semibold text-brand-ink group-hover:text-brand-copper transition-colors flex items-center gap-1">
                            <span>Explorar</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
