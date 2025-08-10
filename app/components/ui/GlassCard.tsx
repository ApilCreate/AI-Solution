"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glowEffect?: boolean;
  borderGradient?: boolean;
  padding?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl";
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  glowEffect = false,
  borderGradient = false,
  padding = "md",
  rounded = "lg"
}: GlassCardProps) {
  const baseClasses = "relative bg-white/5 border border-white/10 backdrop-blur-sm";
  
  const hoverClasses = hover 
    ? "transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10"
    : "";

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const roundedClasses = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl"
  };

  const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${className}`;

  const card = (
    <div className={classes}>
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-inherit blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      )}
      {children}
    </div>
  );

  if (borderGradient) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-purple-600 to-fuchsia-600 p-[2px]">
          <div className={`h-full w-full ${roundedClasses[rounded]} bg-[#05010D]`}></div>
        </div>
        <div className="relative z-10">
          {card}
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      {card}
    </div>
  );
}
