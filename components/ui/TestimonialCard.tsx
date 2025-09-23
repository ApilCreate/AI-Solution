"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  title: string;
  review: string;
  stars: number;
  metric: string;
  impact: string;
  index?: number;
}

export default function TestimonialCard({
  name,
  title,
  review,
  stars,
  metric,
  impact,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * (index % 3), duration: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 group-hover:border-purple-500/30 group-hover:bg-white/10">
        
        {/* Quote Icon */}
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
          <Quote className="w-5 h-5 text-white" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-400/20 to-fuchsia-400/20 text-white rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-xl border border-white/10">
            {name.split(" ")[0][0]}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">{name}</h3>
            <p className="text-purple-300 text-sm font-medium">{title}</p>
          </div>
        </div>

        {/* Review */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          "{review}"
        </p>

        {/* Impact Metric */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-xl border border-purple-500/20">
          <div className="text-sm font-bold text-purple-300 mb-1">{metric}</div>
          <div className="text-xs text-gray-400">{impact}</div>
        </div>

        {/* Stars */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array(stars)
              .fill(0)
              .map((_, idx) => (
                <Star key={idx} className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
              ))}
          </div>
          <div className="text-xs text-gray-400 font-medium">Verified Client</div>
        </div>
      </div>
    </motion.div>
  );
}
