"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isActive: boolean;
  onToggle: () => void;
  index?: number;
}

export default function FAQItem({
  question,
  answer,
  isActive,
  onToggle,
  index = 0
}: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="bg-white/5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex justify-between items-center text-lg font-semibold text-white hover:text-purple-300 transition-colors"
      >
        {question}
        <motion.div 
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-purple-400"
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isActive ? "auto" : 0,
          opacity: isActive ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-6 text-gray-300 leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
}
