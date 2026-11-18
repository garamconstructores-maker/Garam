import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CorporateProfile } from './components/CorporateProfile';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsCatalog } from './components/ProjectsCatalog';
import { Footer } from './components/Footer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { InquiryModal } from './components/InquiryModal';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { VipConciergeWidget } from './components/VipConciergeWidget';
import { Project } from './types/portfolio';
import { PROJECTS } from './data/portfolioData';
import { projectIdFromPath, projectPath } from './data/routes';
import { HOME_TITLE, projectPageMeta } from './data/seo';
import { slugify, track } from './utils/track';

const findProject = (id: string | null | undefined) => PROJECTS.find((p) => p.id === id) ?? null;

interface AppProps {
  /** Obra abierta al cargar: viene de la URL /proyectos/<id>/ (y del prerenderizado). */
  initialProjectId?: string | null;
}

export default function App({ initialProjectId = null }: AppProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => findProject(initialProjectId));
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  // Contexto del formulario: desde dónde se abrió y, si aplica, el servicio o la obra de referencia.
  const [inquiry, setInquiry] = useState<{ origin: string; service?: string; project?: Project }>({ origin: 'sitio' });
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState<boolean>(false);

  // Master Dismiss All function to close all open modals/drawers
  const dismissAllModals = useCallback(() => {
    setSelectedProject(null);
    setIsInquiryOpen(false);
    setIsAiConsultantOpen(false);
  }, []);

  // Global Escape key dismiss-all handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissAllModals();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [dismissAllModals]);

  // Cada ficha tiene su URL (/proyectos/<id>/): se puede compartir, y Atrás la cierra.
  useEffect(() => {
    const target = selectedProject ? projectPath(selectedProject.id) : '/';
    const onProjectPage = projectIdFromPath(window.location.pathname) !== null;
    if ((selectedProject || onProjectPage) && window.location.pathname !== target) {
      window.history.pushState(null, '', target);
    }
    document.title = selectedProject ? projectPageMeta(selectedProject).title : HOME_TITLE;
  }, [selectedProject]);

  useEffect(() => {
    const onPopState = () => setSelectedProject(findProject(projectIdFromPath(window.location.pathname)));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Lock body scroll when any modal/drawer is open
  const hasAnyModalOpen = Boolean(selectedProject || isInquiryOpen || isAiConsultantOpen);

  useEffect(() => {
    if (hasAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasAnyModalOpen]);

  const openInquiry = (origin: string, context: { service?: string; project?: Project } = {}) => {
    dismissAllModals();
    setInquiry({ origin, ...context });
    setIsInquiryOpen(true);
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) =>
    openInquiry(`servicio:${slugify(serviceTitle)}`, { service: serviceTitle });

  // Embudo: cada ficha abierta cuenta como interés en esa obra.
  useEffect(() => {
    if (selectedProject) track('ficha_abierta', `ficha:${selectedProject.id}`);
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-brand-paper text-brand-ink flex flex-col font-sans selection:bg-brand-copper selection:text-white">
      {/* Top Viewport Scroll Progress Bar */}
      <ScrollProgressBar />
      
      {/* Top Header Navigation */}
      <Header
        onOpenPresentation={() => openInquiry('header')}
        onOpenInquiry={() => openInquiry('header')}
        onToggleAiConsultant={() => {
          setIsAiConsultantOpen((prev) => !prev);
        }}
        onDismissAll={dismissAllModals}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onOpenPresentation={() => {
            const obrasEl = document.getElementById('obras');
            obrasEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenInquiry={() => openInquiry('hero')}
        />

        {/* 01 · Projects Catalog Section - 11 Obras Completas */}
        <ProjectsCatalog
          onSelectProject={(project) => {
            dismissAllModals();
            setSelectedProject(project);
          }}
        />

        {/* 02 · Services Section (Compact Editorial Index) */}
        <ServicesSection
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
        />

        {/* 03 · Corporate Profile & Approach (Concise Synthesis) */}
        <CorporateProfile />

      </main>

      {/* Footer */}
      <Footer
        onOpenPresentation={() => {
          const obrasEl = document.getElementById('obras');
          obrasEl?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenInquiry={() => openInquiry('footer')}
      />

      {/* Project Detail Dossier Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRequestSimilar={(project) => openInquiry(`ficha:${project.id}`, { project })}
        />
      )}

      {/* Estimate Inquiry Request Modal */}
      {isInquiryOpen && (
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          preselectedService={inquiry.service}
          referenceProject={inquiry.project}
          origin={inquiry.origin}
        />
      )}

      {/* AI Architectural Advisor Drawer */}
      {isAiConsultantOpen && (
        <AiConsultantDrawer
          isOpen={isAiConsultantOpen}
          onClose={() => setIsAiConsultantOpen(false)}
          onOpenInquiry={() => openInquiry('asesor')}
        />
      )}

      {/* Floating VIP Concierge & WhatsApp Lead Capture Widget */}
      <VipConciergeWidget
        onOpenInquiry={() => openInquiry('concierge')}
        onOpenAiConsultant={() => {
          dismissAllModals();
          setIsAiConsultantOpen(true);
        }}
      />

    </div>
  );
}
