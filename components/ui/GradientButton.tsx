"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function GradientButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon,
  iconPosition = "right"
}: GradientButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-black hover:shadow-lg hover:shadow-white/25 hover:scale-105",
    secondary: "bg-gradient-to-r from-gray-100 to-white hover:from-white hover:to-gray-100 text-black hover:shadow-lg hover:shadow-gray-500/25 hover:scale-105",
    outline: "border border-white/50 text-white hover:bg-white/10 hover:border-white/70 hover:text-white backdrop-blur-sm"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <motion.span 
          className="ml-2"
          whileHover={{ x: variant === "outline" ? 0 : 2 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${classes} group`}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={disabled ? undefined : onClick}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={`${classes} group`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {content}
    </motion.button>
  );
}
