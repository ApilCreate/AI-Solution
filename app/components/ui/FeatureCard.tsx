"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  index?: number;
  className?: string;
  features?: string[];
  useCases?: string[];
  actionButton?: ReactNode;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient = "from-purple-500/10 to-fuchsia-500/10",
  index = 0,
  className = "",
  features,
  useCases,
  actionButton
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative ${className}`}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      
      <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10 h-full flex flex-col">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center border border-white/10`}>
            <div className="text-purple-400">{icon}</div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>

        {/* Description */}
        <p className="text-gray-300 text-center leading-relaxed mb-6 flex-grow">{description}</p>

        {/* Features List */}
        {features && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-purple-300 mb-3">Key Features:</h4>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, featureIndex) => (
                <span
                  key={featureIndex}
                  className="px-3 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Use Cases */}
        {useCases && (
          <div className="mb-6">
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
        )}

        {/* Action Button */}
        {actionButton && (
          <div className="mt-auto pt-4">
            {actionButton}
          </div>
        )}
      </div>
    </motion.div>
  );
}
