import React from 'react';
import { Section } from '../types';
import Hero from './Hero';
import ValueSection from './ValueSection';
import Gallery from './Gallery';
import Recommendations from './Recommendations';
import AboutSection from './AboutSection';

interface SectionRendererProps {
  section: Section;
  isAdmin?: boolean;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return <Hero data={section.data} />;
      case 'comparison':
        return <ValueSection id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      case 'about':
        return <AboutSection id={section.id} title={section.title || ''} text={section.data.text} steps={section.data.steps} summary={section.data.summary} />;
      case 'gallery':
        return <Gallery id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      case 'testimonial':
        return <Recommendations id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderContent()}
    </div>
  );
};

export default SectionRenderer;
