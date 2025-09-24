"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "purple" | "green" | "blue" | "gradient";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  icon,
  className = ""
}: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium backdrop-blur-sm";
  
  const variantClasses = {
    default: "bg-white/5 border border-white/10 text-gray-300",
    purple: "bg-purple-500/20 border border-purple-500/30 text-purple-300",
    green: "bg-green-500/20 border border-green-500/30 text-green-300",
    blue: "bg-blue-500/20 border border-blue-500/30 text-blue-300",
    gradient: "bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 text-purple-300"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </span>
  );
}
