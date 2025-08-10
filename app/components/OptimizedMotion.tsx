"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { memo, ReactNode } from 'react';

interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  initial?: any;
  animate?: any;
  transition?: any;
  whileInView?: any;
  viewport?: any;
  whileHover?: any;
  fallback?: boolean;
}

// Optimized motion component that respects user preferences
const OptimizedMotion = memo(({ 
  children, 
  fallback = true, 
  className = "",
  style = {},
  initial,
  animate,
  transition,
  whileInView,
  viewport,
  whileHover,
  ...props 
}: OptimizedMotionProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  // If user prefers reduced motion, render without animations
  if (shouldReduceMotion && fallback) {
    return <div className={className} style={style}>{children}</div>;
  }
  
  // Optimize animation props for better performance
  const optimizedProps = {
    className,
    style: {
      transform: 'translateZ(0)',
      ...style
    },
    initial,
    animate,
    transition: {
      ease: [0.22, 1, 0.36, 1],
      ...transition
    },
    whileInView,
    viewport: { once: true, margin: "-10px", ...viewport },
    whileHover,
    ...props
  };
  
  return <motion.div {...optimizedProps}>{children}</motion.div>;
});

OptimizedMotion.displayName = 'OptimizedMotion';

// Pre-defined optimized animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export default OptimizedMotion;
