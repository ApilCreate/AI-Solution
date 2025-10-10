'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Star, 
  Search, 
  Filter, 
  Mail, 
  Eye, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  ChevronDown,
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import AdminGuard from '../../../components/AdminGuard';

interface Rating {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'new' | 'replied' | 'published';
  isPublished: boolean;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingStats {
  total: number;
  average: number;
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

export default function RatingsManagement() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    total: 0,
    average: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [statusFilter, dateFilter]);

  const fetchRatings = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter !== 'all') params.append('filter', dateFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/ratings?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRatings();
  };

  const handleReply = async () => {
    if (!selectedRating || !replyMessage.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }

    setIsReplying(true);
    try {
      const response = await fetch(`/api/ratings/${selectedRating.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyMessage }),
      });

      if (response.ok) {
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedRating(null);
        fetchRatings();
        toast.success('Reply sent successfully!');
      } else {
        toast.error('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  const handlePublish = async (ratingId: string, isCurrentlyPublished: boolean) => {
    try {
      const response = await fetch(`/api/ratings/${ratingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !isCurrentlyPublished,
          status: isCurrentlyPublished ? 'new' : 'published'
        }),
      });

      if (response.ok) {
        fetchRatings();
        toast.success(isCurrentlyPublished ? 'Rating unpublished successfully!' : 'Rating published successfully!');
      } else {
        toast.error('Failed to update publish status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating publish status:', error);
      toast.error('Failed to update publish status. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'replied': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
      case 'published': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ratings & Feedback</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer ratings and feedback</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ratings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.average ? stats.average.toFixed(1) : '0.0'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">5-Star Ratings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.fiveStars}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {ratings.filter(r => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(r.createdAt) >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ratings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>

              <div className="flex gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="published">Published</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="year">This Year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ratings List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Ratings ({ratings.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {ratings.map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          {renderStars(rating.rating)}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rating.status)}`}>
                          {rating.status}
                        </span>
                        {rating.isPublished && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                            Published
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{rating.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{rating.email}</p>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3">{rating.comment}</p>

                      {rating.adminReply && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Admin Reply:</p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{rating.adminReply}</p>
                          {rating.repliedAt && (
                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                              Replied on {new Date(rating.repliedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted on {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {rating.status !== 'replied' && (
                        <button
                          onClick={() => {
                            setSelectedRating(rating);
                            setShowReplyModal(true);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Reply
                        </button>
                      )}

                      <button
                        onClick={() => handlePublish(rating.id, rating.isPublished)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          rating.isPublished 
                            ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
                            : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                        }`}
                      >
                        {rating.isPublished ? (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Publish to Testimonials
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reply Modal */}
          {showReplyModal && selectedRating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Reply to {selectedRating.name}
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage('');
                      setSelectedRating(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={isReplying || !replyMessage.trim()}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isReplying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AdminGuard>
  );
}
