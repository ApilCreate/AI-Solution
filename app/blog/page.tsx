"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import blogs from "@/app/data/blogs";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { ArticleCard, GradientButton, SectionHeader, Badge } from "@/app/components/ui";

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="relative min-h-screen bg-[#05010D] text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-gray-500/20 to-slate-500/10" />
        <section className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-48 h-8 bg-white/10 rounded animate-pulse mx-auto" />
            <div className="w-96 h-16 bg-white/10 rounded animate-pulse mx-auto" />
            <div className="w-80 h-6 bg-white/10 rounded animate-pulse mx-auto" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#05010D] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* GIF Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/videos/Blog_page_hero_section.gif')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#05010D]/60 via-[#05010D]/40 to-[#05010D]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge variant="purple">
                📝 Latest Insights & Stories
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">
                Discover Our
              </span>
              <br />
              <span className="text-white">
                Latest Insights
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Explore cutting-edge insights, innovative ideas, and transformative stories 
              that shape tomorrow's world of AI and technology.
            </motion.p>

            {/* CTA Button */}
            <GradientButton
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                const blogSection = document.getElementById('blog-section');
                if (blogSection) {
                  blogSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Articles
            </GradientButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center animate-bounce">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Blog Section */}
      <section id="blog-section" className="relative py-24 px-6 bg-gradient-to-b from-[#05010D] to-[#0a0515]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <SectionHeader
            title="Featured Articles"
            titleGradient="from-purple-400 via-fuchsia-500 to-purple-400"
            description="Dive deep into the world of AI with our curated collection of insights, trends, and breakthrough innovations"
          />

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <ArticleCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                excerpt={blog.content.slice(0, 120) + "..."}
                image={blog.image}
                date={blog.date}
                readTime={blog.readTime}
                href={`/blog/${blog.id}`}
                index={index}
              />
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16"
          >
            <GradientButton variant="outline">
              Load More Articles
            </GradientButton>
          </motion.div>
        </div>
      </section>
    </main>
  );
}