"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  readTime: number;
}

export default function BlogPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        if (sessionDuration < 86400000) {
          setIsAuthenticated(true);
          fetchBlogPosts();
        } else {
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchBlogPosts = async () => {
    // Sample blog posts
    const samplePosts: BlogPost[] = [
      {
        id: '1',
        title: 'The Future of AI in Business',
        excerpt: 'Discover how artificial intelligence is transforming business operations and creating new opportunities.',
        content: 'Full article content here...',
        author: 'Admin',
        publishedAt: '2024-01-15',
        status: 'published',
        tags: ['AI', 'Business', 'Technology'],
        readTime: 5
      },
      {
        id: '2',
        title: 'Machine Learning Best Practices',
        excerpt: 'Learn the essential best practices for implementing machine learning in your projects.',
        content: 'Full article content here...',
        author: 'Admin',
        publishedAt: '2024-01-10',
        status: 'draft',
        tags: ['Machine Learning', 'Best Practices'],
        readTime: 8
      }
    ];
    
    setBlogPosts(samplePosts);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading blog posts...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage blog content
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-16 h-16 text-white opacity-80" />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.readTime} min read
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Tag className="w-3 h-3" />
                    {post.tags.join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Blog Posts */}
        {blogPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No blog posts yet</p>
            <p className="text-sm">Create your first blog post to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
