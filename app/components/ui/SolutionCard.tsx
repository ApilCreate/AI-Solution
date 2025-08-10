"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface SolutionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  metrics: string;
  features: string[];
  useCases: string[];
  index?: number;
  activeCard?: number | null;
  setActiveCard?: (index: number | null) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  actionButton?: ReactNode;
}

export default function SolutionCard({
  title,
  description,
  icon,
  metrics,
  features,
  useCases,
  index = 0,
  activeCard,
  setActiveCard,
  onMouseEnter,
  onMouseLeave,
  actionButton,
}: SolutionCardProps) {
  const handleMouseEnter = () => {
    if (setActiveCard && index !== undefined) {
      setActiveCard(index);
    }
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    if (setActiveCard) {
      setActiveCard(null);
    }
    onMouseLeave?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-lg shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-500 h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30">
            {icon}
          </div>
          <div className="text-xs text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-400/20">
            {metrics}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {description}
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, i) => (
                <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-300 border border-white/10">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Use Cases:</h4>
            <div className="space-y-1">
              {useCases.map((useCase, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span>{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          {actionButton || (
            <button className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors group">
              <span>Learn More</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
