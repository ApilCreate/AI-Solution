'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  User, 
  Eye, 
  Filter,
  RefreshCw,
  Calendar,
  Monitor,
  MapPin,
  ChevronDown,
  LogIn,
  Lock,
  MessageSquare,
  FileText,
  Settings,
  AlertCircle
} from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  action: string;
  description: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  adminEmail: string;
  adminRole: string;
}

interface ActivityLogProps {
  adminId?: string;
}

export default function ActivityLog({ adminId }: ActivityLogProps) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    days: 30
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchActivityLogs();
  }, [page, filters, adminId]);

  const fetchActivityLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        days: filters.days.toString()
      });

      if (adminId) params.append('adminId', adminId);
      if (filters.action) params.append('action', filters.action);

      const response = await fetch(`/api/activity-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setHasMore(data.data.pagination.hasMore);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'logged_in':
        return <LogIn className="w-4 h-4" />;
      case 'password_changed':
        return <Lock className="w-4 h-4" />;
      case 'inquiry_responded':
      case 'inquiry_updated':
        return <MessageSquare className="w-4 h-4" />;
      case 'event_created':
      case 'event_updated':
      case 'event_deleted':
        return <Calendar className="w-4 h-4" />;
      case 'blog_created':
      case 'blog_updated':
      case 'blog_deleted':
        return <FileText className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'logged_in':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'password_changed':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'inquiry_responded':
      case 'inquiry_updated':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'event_created':
      case 'event_updated':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'blog_created':
      case 'blog_updated':
        return 'text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/20';
      case 'event_deleted':
      case 'blog_deleted':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getBrowserInfo = (userAgent: string | null) => {
    if (!userAgent) return 'Unknown Browser';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchActivityLogs();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activity Log
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track all admin activities and system events
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors
                       disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Action Type
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  <option value="logged_in">Login</option>
                  <option value="password_changed">Password Change</option>
                  <option value="inquiry_responded">Inquiry Response</option>
                  <option value="inquiry_updated">Inquiry Update</option>
                  <option value="event_created">Event Created</option>
                  <option value="event_updated">Event Updated</option>
                  <option value="blog_created">Blog Created</option>
                  <option value="blog_updated">Blog Updated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={filters.days}
                  onChange={(e) => handleFilterChange('days', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                  <option value={365}>Last year</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Activity List */}
      <div className="p-6">
        {isLoading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading activities...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No activities found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start space-x-4 p-4 rounded-lg
                         hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.description}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(log.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {log.adminEmail}
                    </span>
                    
                    {log.ipAddress && log.ipAddress !== 'unknown' && (
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {log.ipAddress}
                      </span>
                    )}
                    
                    {log.userAgent && (
                      <span className="flex items-center">
                        <Monitor className="w-3 h-3 mr-1" />
                        {getBrowserInfo(log.userAgent)}
                      </span>
                    )}
                  </div>
                  
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <details className="cursor-pointer">
                        <summary className="flex items-center hover:text-gray-900 dark:hover:text-white">
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Details
                        </summary>
                        <div className="mt-1 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50
                         disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages || isLoading}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50
                         disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}