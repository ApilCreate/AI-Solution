import blogs from "@/app/data/blogs";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, BookOpen, Tag } from "lucide-react";
import { ArticleCard, GlassCard, Badge } from "@/app/components/ui";

interface BlogParams {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogParams) {
  // Ensure the route handler is async and await params
  const { id } = await params;
  const blogId = decodeURIComponent(id);
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) return notFound();

  const relatedBlogs = blogs
    .filter((b) => b.id !== blogId)
    .slice(0, 3);

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
              Technology
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
                {blog.date}
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

      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12">
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
                      <span className="text-white">{blog.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Author</span>
                      <span className="text-white">{blog.author}</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            <div className="lg:col-span-3 order-1 lg:order-2">
              <article className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Related <span className="text-purple-400">Articles</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {relatedBlogs.map((relatedBlog, index) => (
              <ArticleCard
                key={relatedBlog.id}
                id={relatedBlog.id}
                title={relatedBlog.title}
                excerpt={relatedBlog.content.slice(0, 100) + "..."}
                image={relatedBlog.image}
                date={relatedBlog.date}
                readTime={relatedBlog.readTime}
                href={`/blog/${relatedBlog.id}`}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
