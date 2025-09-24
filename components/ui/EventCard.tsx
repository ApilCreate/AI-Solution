"use client";

import { motion } from "framer-motion";
import { Clock, Calendar, MapPin, ArrowRight } from "lucide-react";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  tag?: string;
  index?: number;
  onRegister?: () => void;
}

export default function EventCard({
  title,
  description,
  date,
  time,
  location,
  tag = "AI Workshop",
  index = 0,
  onRegister
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm text-purple-300 text-xs font-medium border border-purple-500/30">
            {tag}
          </span>
          <div className="text-xs text-gray-400">
            {date}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-purple-400" />
            {time}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            {location}
          </div>
        </div>
        
        <motion.button 
          whileHover={{ x: 4 }}
          onClick={onRegister}
          className="text-purple-400 font-medium text-sm hover:text-purple-300 transition-colors flex items-center"
        >
          Register for Event
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
}
