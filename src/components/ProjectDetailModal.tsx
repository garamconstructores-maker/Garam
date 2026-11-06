import React, { useState } from 'react';
import { Project } from '../types/portfolio';
import { handleImageError } from '../utils/imageFallback';
import { BeforeAfterSlider } from './BeforeAfterSlider';

import {
  X,
  MapPin,
  Maximize2,
  Layers,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Compass,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const stages = Array.from(new Set((project?.gallery ?? []).map((media) => media.stage).filter(Boolean))) as string[];
  const items = project ? (activeStage ? project.gallery.filter((media) => media.stage === activeStage) : project.gallery) : [];

  // Keyboard Escape and arrows dismissal/navigation
  React.useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setZoomLevel(1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        setActiveMediaIdx((prev) => (prev + 1) % items.length);
        setZoomLevel(1);
      } else if (e.key === 'ArrowLeft') {
        setActiveMediaIdx((prev) => (prev - 1 + items.length) % items.length);
        setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isLightboxOpen, project]);

  if (!project) return null;

  const activeMedia = items[activeMediaIdx] || items[0];
  const displayUrl = isLightboxOpen && activeMedia?.master8kUrl ? activeMedia.master8kUrl : (activeMedia?.url || project.heroImage);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/55 backdrop-blur-md overflow-y-auto animate-fade-in font-sans cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl my-auto ios-glass-modal rounded-xl overflow-hidden flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 ios-glass px-6 py-4 flex items-center justify-between border-b border-brand-stone/80">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-semibold text-brand-ink tracking-wider uppercase">
              {project.category}
            </span>
            <span aria-hidden="true" className="text-brand-muted">·</span>
            <span className="font-medium text-brand-muted">
              {project.location}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-brand-muted hover:text-brand-ink hover:bg-brand-paper rounded-md transition-colors cursor-pointer"
              aria-label="Cerrar ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
          
          {/* Main Title & Slogan */}
          <div className="space-y-2 border-b border-brand-stone pb-6">
            <h2 className="font-editorial text-4xl font-normal tracking-tight text-brand-ink sm:text-6xl">
              {project.title}
            </h2>
            <p className="text-base sm:text-lg text-brand-muted font-normal">
              {project.subtitle}
            </p>
          </div>

          {/* Technical Spec Sheet Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-5 border-b border-brand-stone text-xs">
            <div>
              <div className="text-brand-muted mb-1">Ubicación</div>
              <div className="font-semibold text-brand-ink flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-copper shrink-0" />
                <span>{project.location}</span>
              </div>
            </div>

            <div>
              <div className="text-brand-muted mb-1">Área Construida</div>
              <div className="font-mono tabular-nums font-semibold text-brand-ink">
                {project.area}
              </div>
            </div>

            {project.parcelArea && (
              <div>
                <div className="text-brand-muted mb-1">Parcela</div>
                <div className="font-mono tabular-nums font-semibold text-brand-ink">{project.parcelArea}</div>
              </div>
            )}

            <div>
              <div className="text-brand-muted mb-1">Estatus de Ejecución</div>
              <div className="font-semibold text-brand-ink">
                {project.status}
              </div>
            </div>
          </div>

          {/* Media Gallery / Photography Viewer */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-brand-muted flex items-center justify-between uppercase tracking-wider">
              <span>Registro Fotográfico de Obra</span>
              <span className="hidden sm:inline font-sans normal-case">{project.location}</span>
            </div>

            {/* Selected Active Media Viewer */}
            {activeMedia && (
              <div className="space-y-2">
                {stages.length > 1 && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de imagen">
                    {[null, ...stages].map((stage) => {
                      const active = activeStage === stage;
                      return (
                        <button
                          key={stage ?? "todas"}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setActiveStage(stage);
                            setActiveMediaIdx(0);
                            setZoomLevel(1);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                            active ? "bg-brand-ink text-white border-brand-ink" : "bg-white text-brand-muted border-brand-stone hover:border-brand-ink/50"
                          }`}
                        >
                          {stage ?? "Todas"}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeMedia.videoUrl ? (
                  <video
                    src={activeMedia.videoUrl}
                    poster={activeMedia.url}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={activeMedia.caption}
                    className="w-full aspect-[16/9] rounded-xl bg-slate-900 border border-brand-stone object-contain"
                  />
                ) : activeMedia.type === 'antes_despues' ? (
                  <BeforeAfterSlider
                    beforeImage={activeMedia.beforeUrl || activeMedia.url}
                    afterImage={activeMedia.afterUrl || activeMedia.url}
                    caption={activeMedia.caption}
                  />
                ) : (
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="relative aspect-[16/9] rounded-xl bg-slate-900 overflow-hidden border border-brand-stone group cursor-zoom-in"
                    title="Haz clic para ampliar a pantalla completa"
                  >
                    <img
                      src={activeMedia.url}
                      alt={activeMedia.caption}
                      referrerPolicy="no-referrer"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                      onError={(e) => handleImageError(e, project.heroImage)}
                    />

                    {/* Top Overlay Info & Inspect button */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-[11px] font-mono tabular-nums font-medium pointer-events-auto">
                        Vista {activeMediaIdx + 1} / {items.length}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLightboxOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-black/65 hover:bg-black/85 backdrop-blur-md rounded-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer pointer-events-auto border border-white/20"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                        <span>Pantalla Completa</span>
                      </button>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white text-xs flex items-end justify-between gap-4">
                      <p className="line-clamp-2 max-w-2xl font-medium">{activeMedia.caption}</p>
                      <span className="text-[10px] text-white/75 font-mono shrink-0 hidden sm:inline">
                        Ampliar vista
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Thumbnails Strip */}
            {items.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {items.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIdx(idx)}
                    className={`relative aspect-[16/10] rounded-lg overflow-hidden transition-all border cursor-pointer group ${
                      activeMediaIdx === idx
                        ? 'border-brand-ink ring-2 ring-brand-ink opacity-100'
                        : 'border-brand-stone opacity-65 hover:opacity-100 hover:border-brand-ink/50'
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={media.caption}
                      referrerPolicy="no-referrer"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => handleImageError(e, project.heroImage)}
                    />
                    {media.videoUrl && (
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                        ▶ Video
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Memoria Descriptiva & Specs */}
          <div className="space-y-10 pt-6 border-t border-brand-stone">
            
            {/* Top Grid: Memoria & Side Specs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-4">
                <div className="text-xs font-semibold text-brand-muted tracking-wider uppercase flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-brand-copper" />
                  <span>CONCEPTO & MEMORIA DESCRIPTIVA</span>
                </div>
                <h3 className="font-editorial text-3xl font-normal tracking-tight text-brand-ink sm:text-4xl">
                  Arquitectura pensada desde la materia y el lugar.
                </h3>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-normal">
                  {project.memoria}
                </p>

                {/* Reto de Ingeniería & Desafío Estructural */}
                {project.engineeringChallenge && (
                  <div className="mt-6 pt-5 border-t border-brand-stone space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-ink tracking-wider uppercase">
                      <HardHat className="w-4 h-4 text-brand-copper" />
                      <span>Reto de Ingeniería & Solución Estructural</span>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-normal">
                      {project.engineeringChallenge}
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-5 bg-white p-6 rounded-xl border border-brand-stone self-start">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
                    Alcance & Especificaciones Clave
                  </h4>
                  <ul className="space-y-2.5 text-xs text-brand-muted">
                    {project.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-copper shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Desglose de Materialidad Noble & Especificación Técnica */}
            {project.detailedMaterials && project.detailedMaterials.length > 0 && (
              <div className="space-y-5 pt-6 border-t border-brand-stone">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-editorial text-2xl sm:text-3xl font-normal text-brand-ink tracking-tight">
                      Materialidad & Especificación Técnica
                    </h4>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Catálogo de materiales nobles, ensayos y métodos constructivos aplicados en la obra.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {project.detailedMaterials.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-white rounded-xl border border-brand-stone space-y-3 hover:border-brand-ink/30 transition-all"
                    >
                      <h5 className="font-editorial text-xl font-normal text-brand-ink border-b border-brand-stone/70 pb-2">
                        {item.name}
                      </h5>

                      <div className="space-y-1 text-xs">
                        <div className="text-brand-ink font-mono text-[11px] leading-relaxed">
                          {item.spec}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs pt-2 border-t border-brand-stone/60">
                        <div className="text-brand-muted text-[11px] leading-relaxed">
                          <span className="font-semibold text-brand-ink">Aplicación: </span>
                          {item.application}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-brand-paper border-t border-brand-stone flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-brand-muted">
            GARAM CONSTRUCTORES · PORTAFOLIO 2026
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-semibold rounded-md bg-brand-ink text-white hover:bg-brand-ink/90 transition-all cursor-pointer"
            >
              Cerrar Ficha de Obra
            </button>
          </div>
        </div>

      </div>

      {/* Full-Screen 8K Ultra-HD Master Lightbox Overlay */}
      {isLightboxOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(false);
            setZoomLevel(1);
          }}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-6 select-none animate-fade-in cursor-default"
        >
          {/* Lightbox Top Control Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between gap-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-white z-20 shrink-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider text-brand-copper-light flex items-center gap-1.5 uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>Visor de Alta Resolución</span>
              </span>
              <span aria-hidden="true" className="text-white/30 hidden sm:inline">·</span>
              <span className="text-xs font-medium text-white/90 hidden sm:inline font-mono tabular-nums">
                {project.title} · Vista {activeMediaIdx + 1}/{items.length}
              </span>
              {activeMedia?.resolution && (
                <span className="text-brand-copper-light text-[11px] font-mono tabular-nums hidden md:inline">
                  ({activeMedia.resolution})
                </span>
              )}
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-2 text-white/90 min-w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer"
                  title="Aumentar zoom 8K"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer ml-1"
                  title="Restablecer tamaño (100%)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomLevel(1);
                }}
                className="p-2 bg-white/15 hover:bg-white/30 rounded-full text-white transition-colors cursor-pointer ml-2"
                aria-label="Cerrar visor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Viewport with Pan/Zoom and Navigation */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center overflow-hidden my-3"
          >
            {/* Left Nav Arrow */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setActiveMediaIdx((prev) => (prev - 1 + items.length) % items.length);
                  setZoomLevel(1);
                }}
                className="absolute left-2 sm:left-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-xl"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main High-Res 8K Master Image */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={displayUrl}
                alt={activeMedia?.caption}
                referrerPolicy="no-referrer"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.18s ease-out',
                  imageRendering: '-webkit-optimize-contrast',
                  maxHeight: '82vh',
                }}
                className="max-w-full object-contain rounded-xl shadow-2xl pointer-events-auto transition-transform"
                onError={(e) => handleImageError(e, project.heroImage)}
              />

            </div>

            {/* Right Nav Arrow */}
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setActiveMediaIdx((prev) => (prev + 1) % items.length);
                  setZoomLevel(1);
                }}
                className="absolute right-2 sm:right-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer shadow-xl"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Info & Thumbnails Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-white z-20 shrink-0 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs sm:text-sm font-medium text-white/95">
                {activeMedia?.caption}
              </p>
              <div className="text-[11px] font-mono text-white/60 flex items-center gap-2">
                <span>{project.location}</span>
                <span>·</span>
                <span className="text-brand-copper-light font-bold">GARAM 8K MASTER ARCHIVE</span>
              </div>
            </div>

            {/* Thumbnails strip in Lightbox */}
            {items.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
                {items.map((media, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveMediaIdx(idx);
                      setZoomLevel(1);
                    }}
                    className={`relative w-16 h-11 sm:w-20 sm:h-13 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      activeMediaIdx === idx
                        ? 'border-amber-400 ring-2 ring-amber-400 scale-105 opacity-100'
                        : 'border-white/20 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={media.url}
                      alt={media.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
