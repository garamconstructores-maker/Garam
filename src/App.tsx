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

const findProject = (id: string | null | undefined) => PROJECTS.find((p) => p.id === id) ?? null;

interface AppProps {
  /** Obra abierta al cargar: viene de la URL /proyectos/<id>/ (y del prerenderizado). */
  initialProjectId?: string | null;
}

export default function App({ initialProjectId = null }: AppProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => findProject(initialProjectId));
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string | undefined>(undefined);
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

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    dismissAllModals();
    setSelectedServiceForInquiry(serviceTitle);
    setIsInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-paper text-brand-ink flex flex-col font-sans selection:bg-brand-copper selection:text-white">
      {/* Top Viewport Scroll Progress Bar */}
      <ScrollProgressBar />
      
      {/* Top Header Navigation */}
      <Header
        onOpenPresentation={() => {
          dismissAllModals();
          setSelectedServiceForInquiry(undefined);
          setIsInquiryOpen(true);
        }}
        onOpenInquiry={() => {
          dismissAllModals();
          setSelectedServiceForInquiry(undefined);
          setIsInquiryOpen(true);
        }}
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
          onOpenInquiry={() => {
            dismissAllModals();
            setSelectedServiceForInquiry(undefined);
            setIsInquiryOpen(true);
          }}
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
        onOpenInquiry={() => {
          dismissAllModals();
          setSelectedServiceForInquiry(undefined);
          setIsInquiryOpen(true);
        }}
      />

      {/* Project Detail Dossier Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Estimate Inquiry Request Modal */}
      {isInquiryOpen && (
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          preselectedService={selectedServiceForInquiry}
        />
      )}

      {/* AI Architectural Advisor Drawer */}
      {isAiConsultantOpen && (
        <AiConsultantDrawer
          isOpen={isAiConsultantOpen}
          onClose={() => setIsAiConsultantOpen(false)}
          onOpenInquiry={() => {
            dismissAllModals();
            setIsInquiryOpen(true);
          }}
        />
      )}

      {/* Floating VIP Concierge & WhatsApp Lead Capture Widget */}
      <VipConciergeWidget
        onOpenInquiry={() => {
          dismissAllModals();
          setSelectedServiceForInquiry(undefined);
          setIsInquiryOpen(true);
        }}
        onOpenAiConsultant={() => {
          dismissAllModals();
          setIsAiConsultantOpen(true);
        }}
      />

    </div>
  );
}
