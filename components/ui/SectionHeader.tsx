"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: ReactNode;
  alignment?: "left" | "center" | "right";
  titleGradient?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  badge,
  alignment = "center",
  titleGradient = "from-white via-purple-300 to-white",
  className = ""
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`mb-16 ${alignmentClasses[alignment]} ${className}`}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          {badge}
        </motion.div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-purple-400 font-medium mb-4"
        >
          {subtitle}
        </motion.h3>
      )}

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      )}

      {/* Decorative Line */}
      {alignment === "center" && (
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 mx-auto rounded-full mt-8"
        />
      )}
    </motion.div>
  );
}
