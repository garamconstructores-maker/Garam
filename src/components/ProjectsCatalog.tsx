import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types/portfolio';
import { handleImageError } from '../utils/imageFallback';
import {
  Search,
  Eye,
  MapPin,
  Maximize2,
  X,
  Layers,
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
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Per-card active photo preview map (project id -> photo idx)

  const categories: string[] = [
    'Todos',
    'Residencial',
    'Comercial',
    'Corporativo',
    'Salud / Especializada',
    'Urbanismo',
  ];

  const statuses: string[] = ['Todos', 'Ejecutado', 'En ejecución', 'Por ejecutar'];

  const filteredProjects = useMemo(() => {
    const filtered = PROJECTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'Todos' || p.status === selectedStatus;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.memoria.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });

    // Obras destacadas primero, en el orden definido; el resto conserva su orden.
    const rank = (id: string) => {
      const index = FEATURED_IDS.indexOf(id);
      return index === -1 ? FEATURED_IDS.length : index;
    };
    return [...filtered].sort((a, b) => rank(a.id) - rank(b.id));
  }, [selectedCategory, selectedStatus, searchQuery]);

  return (
    <section id="obras" className="py-20 sm:py-28 bg-brand-paper border-b border-brand-stone font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-stone pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-semibold text-brand-muted tracking-widest uppercase flex items-center gap-2">
                <span>03 · CATÁLOGO DE OBRAS</span>
                <span className="w-1.5 h-1.5 rounded-md bg-emerald-600" />
                <span className="text-brand-ink font-bold">11 OBRAS EMBLEMÁTICAS</span>
              </div>
              <h2 className="font-editorial text-4xl font-normal leading-tight tracking-tight text-brand-ink sm:text-6xl">
                Arquitectura construida.<br />
                <span className="text-brand-muted font-normal">
                  Fotografía real de estructura, espacialidad y acabados de lujo.
                </span>
              </h2>
            </div>

            <div className="text-xs font-semibold text-brand-muted">
              Mostrando {filteredProjects.length} de {PROJECTS.length} Obras
            </div>
          </div>
        </FadeIn>

        {/* Filter Controls Bar with Animated Segmented Layout Tabs */}
        <FadeIn delay={0.1} direction="up">
          <div className="bg-white rounded-2xl p-6 border border-brand-stone shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted/80" />
                <input
                  type="search"
                  aria-label="Buscar obras por nombre, ubicación o tipología"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por obra, ubicación o tipología..."
                  className="w-full pl-10 pr-9 py-2.5 bg-brand-paper rounded-md border border-transparent text-xs text-brand-ink placeholder:text-brand-muted/80 focus:outline-none focus:border-brand-ink focus-visible:ring-2 focus-visible:ring-brand-copper/40 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted/80 hover:text-brand-ink p-0.5"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs text-brand-muted/80 mr-2 whitespace-nowrap">
                  Estatus:
                </span>
                <div role="group" aria-label="Filtrar por estatus" className="flex items-center p-1 bg-brand-paper rounded-md">
                  {statuses.map((st) => {
                    const isActive = selectedStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedStatus(st)}
                        aria-pressed={isActive}
                        className={`relative px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer z-10 ${
                          isActive ? 'text-white' : 'text-brand-muted hover:text-brand-ink'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeStatusIndicator"
                            className="absolute inset-0 bg-brand-ink rounded-md shadow-xs -z-10"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          />
                        )}
                        <span>{st}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Category Animated Segmented Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-brand-stone scrollbar-none">
              <span className="text-xs text-brand-muted/80 mr-2 whitespace-nowrap">
                Categoría:
              </span>
              <div role="group" aria-label="Filtrar por categoría" className="flex items-center gap-1.5 p-1 bg-brand-paper rounded-md">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={isActive}
                      className={`relative px-4 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer z-10 ${
                        isActive ? 'text-white' : 'text-brand-muted hover:text-brand-ink'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryIndicator"
                          className="absolute inset-0 bg-brand-ink rounded-md shadow-xs -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Dynamic Editorial Projects Layout */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-16 text-center bg-white rounded-2xl border border-brand-stone space-y-4"
            >
              <p className="text-sm text-brand-muted">
                No se encontraron proyectos con los criterios de búsqueda seleccionados.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSelectedStatus('Todos');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-md bg-brand-ink text-white text-xs font-semibold cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategory}-${selectedStatus}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* 1. Flagship Featured Project (First Item in Asymmetric Full-Width Banner) */}
              {filteredProjects.length > 0 && (() => {
                const flagship = filteredProjects[0];

                return (
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onSelectProject(flagship)}
                    className="group bg-white rounded-2xl border border-brand-stone overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
                      
                      {/* Left: Cinematic Main Photograph */}
                      <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full bg-slate-900 overflow-hidden">
                        <CoverCarousel project={flagship} className="absolute inset-0 w-full h-full" loading="eager" />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-md text-xs font-bold text-brand-ink shadow-sm">
                            Obra Insignia · {flagship.number}
                          </span>
                        </div>

                        {/* Hover Prompt */}
                        <div className="absolute inset-0 bg-brand-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="px-5 py-2.5 bg-white text-brand-ink text-xs font-bold rounded-md shadow-2xl flex items-center gap-2">
                            <Maximize2 className="w-4 h-4" />
                            <span>Abrir Ficha Técnica y Fotos</span>
                          </div>
                        </div>

                      </div>

                      {/* Right: Editorial Story & Technical Specs */}
                      <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted/80 tracking-wider uppercase">
                            <MapPin className="w-3.5 h-3.5 text-brand-ink" />
                            <span>{flagship.location}</span>
                            <span aria-hidden="true">·</span>
                            <span>{flagship.category}</span>
                          </div>

                          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink group-hover:text-brand-copper transition-colors">
                            {flagship.title}
                          </h3>

                          <p className="text-sm sm:text-base text-brand-muted font-normal leading-relaxed">
                            {flagship.slogan}
                          </p>

                          <p className="text-xs sm:text-sm text-brand-muted/80 line-clamp-3 leading-relaxed">
                            {flagship.memoria}
                          </p>

                          {/* Metric Highlights */}
                          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-brand-ink border-t border-brand-stone">
                            <div className="flex items-center gap-1.5">
                              <span className="text-brand-muted/80">Construcción:</span>
                              <span className="font-bold">{flagship.area}</span>
                            </div>
                            {flagship.parcelArea && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-brand-muted/80">Parcela:</span>
                                <span className="font-bold">{flagship.parcelArea}</span>
                              </div>
                            )}
                          </div>

                          {/* Materiality */}
                          {flagship.materials && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {flagship.materials.map((mat, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-md bg-brand-paper text-brand-ink text-[10px] font-medium border border-brand-stone"
                                >
                                  {mat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* CTA button inside editorial box */}
                        <div className="pt-4 border-t border-brand-stone flex items-center justify-between text-xs font-semibold text-brand-ink">
                          <span className="group-hover:underline flex items-center gap-1.5">
                            <Layers className="w-4 h-4" />
                            <span>Explorar Dossier Técnico Completo</span>
                          </span>
                          <span className="text-brand-muted/80 font-mono">
                            Obra {flagship.number} / 11
                          </span>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })()}

              {/* 2. Secondary Projects in Balanced Editorial Grid */}
              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.slice(1).map((project) => {

                    return (
                      <motion.div
                        key={project.id}
                        whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(37, 34, 90, 0.1), 0 8px 10px -6px rgba(37, 34, 90, 0.05)' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="group bg-white rounded-2xl border border-brand-stone overflow-hidden flex flex-col justify-between h-full cursor-pointer shadow-xs"
                        onClick={() => onSelectProject(project)}
                      >
                        <div className="space-y-4">
                          
                          {/* Project Photography */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 group">
                            <CoverCarousel project={project} className="absolute inset-0 w-full h-full" />


                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-md text-[11px] font-semibold text-brand-ink shadow-sm">
                                {project.category}
                              </span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-brand-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                              <div className="px-4 py-2 bg-white text-brand-ink text-xs font-bold rounded-md shadow-xl flex items-center gap-1.5">
                                <Eye className="w-4 h-4" />
                                <span>Ver Ficha Técnica y Fotos</span>
                              </div>
                            </div>
                          </div>


                          {/* Text Content */}
                          <div className="p-6 pt-2 pb-6 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-brand-muted/80 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-brand-ink" />
                              <span>{project.location}</span>
                            </div>

                            <h3 className="text-2xl font-bold tracking-tight text-brand-ink group-hover:text-brand-copper transition-colors">
                              {project.title}
                            </h3>

                            <p className="text-xs sm:text-sm text-brand-muted line-clamp-2 leading-relaxed font-normal">
                              {project.slogan}
                            </p>

                            <div className="pt-2 flex items-center gap-3 text-xs text-brand-muted/80 font-mono">
                              <span>Construcción: {project.area}</span>
                              {project.parcelArea && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>Parcela: {project.parcelArea}</span>
                                </>
                              )}
                            </div>

                            {/* Materials Highlights */}
                            {project.materials && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {project.materials.slice(0, 3).map((mat, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-1 rounded-md bg-brand-paper text-brand-ink text-[10px] font-medium border border-brand-stone"
                                  >
                                    {mat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
