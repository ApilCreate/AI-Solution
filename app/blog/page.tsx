"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import staticBlogs from "@/data/blogs";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, Loader2, BookOpen } from "lucide-react";
import Galaxy from "../../components/Galaxy";
import { PointerHighlight } from "../../components/ui/pointer-highlight";
import H1Reveal from "../../components/H1Reveal";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  date: string;
  readTime: string;
  author?: string;
  category?: string;
  status?: string;
  publishedAt?: string;
}

export default function BlogPage() {
  const [mounted, setMounted] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [databaseBlogsLoaded, setDatabaseBlogsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize with static blogs and automatically load database blogs
    initializeBlogs();
  }, []);

  const initializeBlogs = async () => {
    // Convert static blogs to match the Blog interface
    const convertedStaticBlogs: Blog[] = staticBlogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.content.slice(0, 120) + "...",
      image: blog.image,
      date: blog.date,
      readTime: blog.readTime
    }));
    
    setBlogs(convertedStaticBlogs);
    
    // Automatically load database blogs on page load
    await loadDatabaseBlogs();
  };

  const loadDatabaseBlogs = async () => {
    // Prevent multiple loads
    if (databaseBlogsLoaded) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const databaseBlogs = await response.json();
        // Filter only published blogs
        const publishedBlogs = databaseBlogs.filter((blog: any) => blog.status === 'published');
        
        // Convert database blogs to match the interface
        const convertedDbBlogs: Blog[] = publishedBlogs.map((blog: any) => ({
          id: `db-${blog.id}`, // Prefix to distinguish from static blogs
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt || blog.content.slice(0, 120) + "...",
          image: blog.image,
          date: blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString(),
          readTime: blog.readTime || '5 min read',
          author: blog.author,
          category: blog.category
        }));
        
        // Prevent duplicates by checking existing IDs
        setBlogs(prev => {
          const existingIds = new Set(prev.map(blog => blog.id));
          const newBlogs = convertedDbBlogs.filter(blog => !existingIds.has(blog.id));
          return [...prev, ...newBlogs];
        });
        setDatabaseBlogsLoaded(true);
        setHasMore(false); // All blogs loaded
      } else {
        console.error('Failed to fetch database blogs');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading database blogs:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <main className="relative min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
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
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Galaxy Background */}
        <div className="absolute inset-0 z-0">
          <Galaxy />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-lg text-slate-300 border border-white/20 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Latest Insights & Stories
                </span>
              </div>
              <H1Reveal>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Discover Our 
                <div className="flex justify-center">
                  <PointerHighlight>
                    <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                      Latest Insights
                    </span>
                  </PointerHighlight>
                </div>
              </h1>
              </H1Reveal>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Explore cutting-edge insights, innovative ideas, and transformative stories that shape tomorrow's world of AI and technology.
              </p>
            </motion.div>
          </div>
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
      <section id="blog-section" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <div className="flex justify-center">
                <PointerHighlight>
                  <span className="bg-gradient-to-r from-[#00FFB7] to-[#0000E0] bg-clip-text text-transparent">
                    Featured Articles
                  </span>
                </PointerHighlight>
              </div>
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Dive deep into the world of AI with our curated collection of insights, trends, and breakthrough innovations
            </p>
          </motion.div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => {
              // Determine the correct href based on blog type
              const href = blog.id.startsWith('db-') 
                ? `/blog/dynamic/${blog.id.replace('db-', '')}` 
                : `/blog/${blog.id}`;
              
              return (
                <motion.div
                  key={`${blog.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 group-hover:border-slate-600/70 rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02]">
                    {/* Blog Image */}
                    {blog.image && (
                      <div className="w-full h-48 mb-6 rounded-xl overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Blog Content */}
                    <div className="space-y-4">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{blog.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-base text-slate-300 line-clamp-3 leading-relaxed">
                        {blog.excerpt || blog.content.slice(0, 120) + "..."}
                      </p>

                      {/* Read More Link */}
                      <Link 
                        href={href}
                        className="inline-flex items-center gap-2 text-white hover:text-slate-200 transition-colors font-medium"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Loading Indicator for Database Blogs */}
          {loading && !databaseBlogsLoaded && (
            <div className="text-center mt-16">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-slate-400">Loading more articles...</span>
              </div>
            </div>
          )}

          {/* Show completion message */}
          {databaseBlogsLoaded && blogs.length > staticBlogs.length && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mt-16"
            >
              <p className="text-slate-400">
                All articles loaded! 📚 Check back soon for more insights.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}