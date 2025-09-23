"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author?: string;
  href: string;
  index?: number;
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  image,
  date,
  readTime,
  author,
  href,
  index = 0
}: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Link href={href}>
        <article className="h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Read Time Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {readTime}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Date */}
            <div className="flex items-center text-sm text-purple-300">
              <Calendar className="w-4 h-4 mr-2" />
              {date}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
              {excerpt}
            </p>

            {/* Author (if provided) */}
            {author && (
              <div className="text-xs text-gray-400">
                By {author}
              </div>
            )}

            {/* Read More */}
            <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors duration-300">
              Read Article
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
