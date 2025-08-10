"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShowcaseCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  stats: string;
  category: string;
  index?: number;
  actionButton?: ReactNode;
}

export default function ShowcaseCard({
  id,
  title,
  description,
  image,
  stats,
  category,
  index = 0,
  actionButton
}: ShowcaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group"
    >
      <div className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:bg-white/[0.08]">
        {/* Badges */}
        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-purple-300 text-xs font-medium border border-purple-500/20">
              {category}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm text-green-300 text-xs font-medium border border-green-500/20">
              {stats}
            </span>
          </div>
          
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
          
          {/* Action Button or Learn More Link */}
          {actionButton || (
            <motion.div 
              className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors duration-300"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span>Learn More</span>
              <motion.svg 
                className="w-4 h-4 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
