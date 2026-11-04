import React, { useEffect, useState } from 'react';
import { Project } from '../types/portfolio';
import { handleImageError } from '../utils/imageFallback';

const CYCLE_MS = 1400;
const MAX_COVER_IMAGES = 4;

// Portada de la obra: primero la foto principal y luego las primeras de la galería.
export const getCoverImages = (project: Project): string[] => {
  const urls = [project.heroImage, ...project.gallery.map((media) => media.url)];
  return Array.from(new Set(urls.filter(Boolean))).slice(0, MAX_COVER_IMAGES);
};

interface CoverCarouselProps {
  project: Project;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export const CoverCarousel: React.FC<CoverCarouselProps> = ({ project, className = '', loading = 'lazy' }) => {
  const images = getCoverImages(project);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Con el mouse encima la portada cambia sola; sin movimiento reducido, solo con los puntos.
  useEffect(() => {
    if (!hovered || reduceMotion || images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [hovered, reduceMotion, images.length]);

  const handleLeave = () => {
    setHovered(false);
    setIndex(0);
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-900 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
    >
      {/* Fondo: la misma foto borrosa llena los espacios que deja la foto completa. */}
      <img
        src={images[index]}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 transition-opacity duration-700"
        loading="lazy"
      />

      {/* Fotos de la obra, completas, con fundido entre ellas. */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? project.title : ''}
          referrerPolicy="no-referrer"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
          className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          loading={i === 0 ? loading : 'lazy'}
          onError={(e) => handleImageError(e, project.heroImage)}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${images.length}`}
              aria-current={i === index}
              onClick={(event) => {
                event.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
