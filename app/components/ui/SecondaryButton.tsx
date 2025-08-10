"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Link from "next/link";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  variant?: "outline" | "solid";
  loading?: boolean;
}

export default function SecondaryButton({
  children,
  onClick,
  href,
  size = "md",
  className = "",
  disabled = false,
  icon,
  iconPosition = "right",
  fullWidth = false,
  variant = "outline",
  loading = false
}: SecondaryButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl";
  
  const variantClasses = {
    outline: "border border-purple-400/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-300 hover:text-purple-200 backdrop-blur-sm",
    solid: "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === "left" && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <motion.span 
          className="ml-2"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href}>
        <motion.span
          className={`${classes} group cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      className={`${classes} group`}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
    >
      {content}
    </motion.button>
  );
}
