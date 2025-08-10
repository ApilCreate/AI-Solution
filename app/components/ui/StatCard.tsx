"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  description?: string;
  index?: number;
  gradient?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  description,
  index = 0,
  gradient = "from-purple-500/20 to-fuchsia-500/20"
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center space-y-3"
    >
      <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm`}>
        <div className="text-purple-400">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-purple-300 font-medium">{label}</div>
      {description && (
        <div className="text-xs text-gray-400">{description}</div>
      )}
    </motion.div>
  );
}
