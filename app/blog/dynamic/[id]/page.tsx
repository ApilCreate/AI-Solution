"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, BookOpen, Tag, Share2 } from "lucide-react";
import { ArticleCard, GlassCard, Badge } from "@/app/components/ui";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
  readTime: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function DynamicBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string);
      fetchRelatedBlogs();
    }
  }, [params.id]);

  const fetchBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      
      if (response.ok) {
        const blogData = await response.json();
        
        // Only show published blogs
        if (blogData.status !== 'published') {
          setError('Blog post not found or not published');
          return;
        }
        
        setBlog(blogData);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const allBlogs = await response.json();
        const publishedBlogs = allBlogs
          .filter((b: any) => b.status === 'published' && b.id !== params.id)
          .slice(0, 3);
        setRelatedBlogs(publishedBlogs);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05010D] text-white">
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-full h-12 bg-white/10 rounded animate-pulse" />
              <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-[#05010D] text-white">
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">
              {error || "The blog post you're looking for doesn't exist or is no longer available."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Blog
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05010D] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Blog
          </Link>

          <div className="space-y-6">
            <Badge variant="purple" icon={<Tag className="w-4 h-4" />}>
              {blog.category || 'Technology'}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                By {blog.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blog.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {blog.readTime}
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Article
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.image && (
        <section className="px-6 mb-16">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-32 space-y-6">
                <GlassCard padding="md" rounded="lg">
                  <h3 className="font-semibold text-white mb-3">Article Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Read Time</span>
                      <span className="text-white">{blog.readTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Published</span>
                      <span className="text-white">{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Author</span>
                      <span className="text-white">{blog.author}</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <article className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Related <span className="text-purple-400">Articles</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <ArticleCard
                  key={relatedBlog.id}
                  id={`db-${relatedBlog.id}`}
                  title={relatedBlog.title}
                  excerpt={relatedBlog.excerpt || relatedBlog.content.slice(0, 100) + "..."}
                  image={relatedBlog.image || '/images/default-blog.png'}
                  date={new Date(relatedBlog.publishedAt || relatedBlog.createdAt).toLocaleDateString()}
                  readTime={relatedBlog.readTime || '5 min read'}
                  href={`/blog/dynamic/${relatedBlog.id}`}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}