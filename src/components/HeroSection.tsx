import React from 'react';
import { HomepageHero } from './HomepageHero';

interface HeroSectionProps {
  onOpenPresentation: () => void;
  onOpenInquiry: () => void;
  isPageHeading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPresentation,
  onOpenInquiry,
  isPageHeading,
}) => {
  return (
    <HomepageHero
      onOpenPresentation={onOpenPresentation}
      onOpenInquiry={onOpenInquiry}
      isPageHeading={isPageHeading}
    />
  );
};
