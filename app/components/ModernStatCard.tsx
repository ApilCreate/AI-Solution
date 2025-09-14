"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  color?: string;
  index?: number;
}

export default function ModernStatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = 'blue',
  index = 0 
}: ModernStatCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      teal: 'from-teal-500 to-teal-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <motion.p 
            className="text-sm font-medium text-muted-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {title}
          </motion.p>
          
          <motion.div
            className="text-3xl font-bold text-foreground mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.div>

          {change && (
            <motion.div
              className={`text-sm font-medium ${getTrendColor(change.trend)}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <span className="flex items-center gap-1">
                {change.trend === 'up' && '↗'}
                {change.trend === 'down' && '↘'}
                {change.trend === 'neutral' && '→'}
                {change.value}
              </span>
            </motion.div>
          )}
        </div>

        <motion.div
          className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(color)} shadow-lg`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: index * 0.1 + 0.5,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
        style={{ 
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />
    </motion.div>
  );
}
