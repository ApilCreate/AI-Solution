"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface HorizontalScrollSection {
  title: string;
  description: React.ReactNode;
  content?: React.ReactNode;
}

interface HorizontalScrollProps {
  sections: HorizontalScrollSection[];
  contentClassName?: string;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  sections,
  contentClassName,
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const sectionWidth = containerWidth;
      
      const currentSection = Math.round(scrollLeft / sectionWidth);
      const clampedSection = Math.max(0, Math.min(currentSection, sections.length - 1));
      
      if (clampedSection !== activeSection) {
        setActiveSection(clampedSection);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeSection, sections.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeSection > 0) {
        scrollToSection(activeSection - 1);
      } else if (e.key === 'ArrowRight' && activeSection < sections.length - 1) {
        scrollToSection(activeSection + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections.length]);

  // Smooth scroll to specific section
  const scrollToSection = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const sectionWidth = container.clientWidth;
    const targetScrollLeft = index * sectionWidth;
    
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden mt-24 pb-16 mb-10">
      {/* Progress Indicator */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
          <span className="text-white font-medium">
            {activeSection + 1}/{sections.length}
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="hidden lg:block absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => scrollToSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          aria-label="Previous section"
          className={cn(
            "p-2 lg:p-3 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700 transition-all duration-300",
            activeSection === 0 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-black/70 hover:scale-110"
          )}
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </button>
      </div>

      <div className="hidden lg:block absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20">
        <button
          onClick={() => scrollToSection(Math.min(sections.length - 1, activeSection + 1))}
          disabled={activeSection === sections.length - 1}
          aria-label="Next section"
          className={cn(
            "p-2 lg:p-3 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700 transition-all duration-300",
            activeSection === sections.length - 1 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-black/70 hover:scale-110"
          )}
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3" role="tablist" aria-label="Section navigation">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            role="tab"
            aria-label={`Go to section ${index + 1}`}
            aria-selected={activeSection === index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeSection === index 
                ? "bg-white scale-125" 
                : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex h-full overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {sections.map((section, index) => (
          <div
            key={index}
            ref={(el) => { sectionRefs.current[index] = el; }}
            className="flex-shrink-0 w-full h-full flex items-center justify-center relative"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />
            
            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between h-full gap-8 lg:gap-0">
              {/* Left Side - Text Content */}
              <motion.div 
                className="flex-1 max-w-2xl lg:pr-12 text-center lg:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: activeSection === index ? 1 : 0.7,
                  x: activeSection === index ? 0 : -20
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 lg:mb-8 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: activeSection === index ? 1 : 0.5,
                    y: activeSection === index ? 0 : 20
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {section.title}
                </motion.h2>
                
                <motion.div 
                  className="text-base md:text-lg text-gray-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeSection === index ? 1 : 0.6 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {section.description}
                </motion.div>
              </motion.div>

              {/* Right Side - Visual Content */}
              <motion.div 
                className="flex-1 flex items-center justify-center max-w-lg lg:max-w-xl w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: activeSection === index ? 1 : 0.7,
                  x: activeSection === index ? 0 : 20,
                  scale: activeSection === index ? 1 : 0.95
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className={cn(
                  "w-full h-64 md:h-80 lg:h-96 rounded-xl shadow-2xl overflow-hidden",
                  "bg-gradient-to-br from-gray-800 to-gray-900",
                  "border border-gray-700",
                  contentClassName
                )}>
                  {section.content}
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar Hide Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};