"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface ProjectCardProps {
  name: string;
  icon: ReactNode;
  description: string;
  keyFeatures: string[];
  useCases: string[];
  gradient: string;
  index?: number;
  actionButton?: ReactNode;
}

export default function ProjectCard({
  name,
  icon,
  description,
  keyFeatures,
  useCases,
  gradient,
  index = 0,
  actionButton
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10 h-full flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center border border-white/10`}>
            <div className="text-purple-400">{icon}</div>
          </div>
          <div className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
            AI Powered
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
        <p className="text-gray-300 leading-relaxed mb-6 flex-grow">{description}</p>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">Key Features:</h4>
          <div className="flex flex-wrap gap-2">
            {keyFeatures.map((feature, featureIndex) => (
              <span
                key={featureIndex}
                className="px-3 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">Use Cases:</h4>
          <ul className="text-xs text-gray-400 space-y-2">
            {useCases.map((useCase, useCaseIndex) => (
              <li key={useCaseIndex} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></span>
                {useCase}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action Button */}
        {actionButton && (
          <div className="mt-auto">
            {actionButton}
          </div>
        )}
      </div>
    </motion.div>
  );
}
