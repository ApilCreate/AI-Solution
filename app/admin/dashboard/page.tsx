'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import AdminGuard from '../../components/AdminGuard';

// Types
interface DashboardStats {
  totalInquiries: number;
  newThisWeek: number;
  pendingInquiries: number;
  completedInquiries: number;
  responseRate: string;
  avgResponseTime: string;
}

interface ChartData {
  month: string;
  inquiries: number;
  completed: number;
  pending: number;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: any; // Add index signature for recharts compatibility
}

interface CountryData {
  country: string;
  count: number;
}

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  reason: string;
  createdAt: string;
  status: string;
}

// Stat Card Component
const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: any;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newThisWeek: 0,
    pendingInquiries: 0,
    completedInquiries: 0,
    responseRate: '0%',
    avgResponseTime: '0h'
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Starting fetchDashboardData...');
      
      // Fetch inquiries data
      const inquiriesRes = await fetch('/api/inquiries/list', {
        method: 'GET'
      });
      
      console.log('Inquiries response status:', inquiriesRes.status);
      
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        console.log('Inquiries data received:', inquiriesData);
        
        // Handle the API response structure { inquiries: [], total, page, limit, hasMore }
        const inquiries = Array.isArray(inquiriesData) ? inquiriesData : (inquiriesData.inquiries || []);
        console.log('📊 Processed inquiries array:', inquiries);
        console.log('📈 Total inquiries count:', inquiries.length);
        
        // Calculate stats
        const totalCount = inquiries.length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const newThisWeek = inquiries.filter((inquiry: any) =>
          new Date(inquiry.createdAt) >= sevenDaysAgo
        ).length;
        
        const pendingCount = inquiries.filter((inquiry: any) => 
          inquiry.status === 'new' || inquiry.status === 'pending'
        ).length;
        
        const completedCount = inquiries.filter((inquiry: any) => 
          inquiry.status === 'resolved' || inquiry.status === 'completed'
        ).length;

        // Generate monthly chart data for the last 12 months
        const months = [];
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          
          // Filter inquiries for this month and calculate values
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          const monthInquiries = inquiries.filter((inquiry: any) => {
            const inquiryDate = new Date(inquiry.createdAt);
            return inquiryDate >= monthStart && inquiryDate <= monthEnd;
          });
          
          const monthCompleted = monthInquiries.filter((inquiry: any) => 
            inquiry.status === 'resolved' || inquiry.status === 'completed'
          ).length;
          
          const monthPending = monthInquiries.filter((inquiry: any) => 
            inquiry.status === 'new' || inquiry.status === 'pending'
          ).length;
          
          months.push({
            month: monthName,
            inquiries: monthInquiries.length,
            completed: monthCompleted,
            pending: monthPending
          });
        }

        // Generate category data based on inquiry reasons
        const reasonCounts = inquiries.reduce((acc: any, inquiry: any) => {
          const reason = inquiry.reason || 'Other';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {});

        const categories = Object.entries(reasonCounts).map(([name, value]) => ({
          name,
          value: value as number
        }));

        // Generate country data based on inquiry countries
        const countryCounts = inquiries.reduce((acc: any, inquiry: any) => {
          const country = inquiry.country || 'Unknown';
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});

        const countries = Object.entries(countryCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([country, count]) => ({
            country,
            count: count as number
          }));

        // Get recent inquiries (latest 4)
        const recent = inquiries
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4)
          .map((inquiry: any) => ({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            reason: inquiry.reason,
            createdAt: inquiry.createdAt,
            status: inquiry.status
          }));

        setStats({
          totalInquiries: totalCount,
          newThisWeek: newThisWeek,
          pendingInquiries: pendingCount,
          completedInquiries: completedCount,
          responseRate: totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}%` : '0%',
          avgResponseTime: '2.4h'
        });

        setChartData(months);
        setCategoryData(categories);
        setCountryData(countries);
        setRecentInquiries(recent);
      } else {
        console.error('Failed to fetch inquiries:', inquiriesRes.status, inquiriesRes.statusText);
        const errorData = await inquiriesRes.text();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const BLUE_SHADES = ['#1E3A8A', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];

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
    <DashboardLayout>
      <AdminGuard>
        <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your AI solution platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Inquiries"
            value={stats.totalInquiries}
            change="+12% from last week"
            trend="up"
            icon={MessageSquare}
            color="blue"
          />
          <StatCard
            title="New This Week"
            value={stats.newThisWeek}
            change="+8% from last week"
            trend="up"
            icon={Calendar}
            color="green"
          />
          <StatCard
            title="Pending"
            value={stats.pendingInquiries}
            change="-5% from last week"
            trend="down"
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Completed"
            value={stats.completedInquiries}
            change="+15% from last week"
            trend="up"
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/settings"
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Change password & view activity</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/admin/inquiries"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">View Inquiries</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage customer inquiries</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/events"
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Events</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create and edit events</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Detailed insights & reports</p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Inquiry Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Inquiry Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#3B82F6"
                  fill="url(#colorInquiries)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Inquiry Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inquiry Categories</h3>
              <Activity className="w-5 h-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={false}
                  outerRadius={100}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index % BLUE_SHADES.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} inquiries`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BLUE_SHADES[index % BLUE_SHADES.length] }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Countries Chart and Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Countries Chart - Takes 2/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inquiries by Country</h3>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="country" 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-sm"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Inquiries - Takes 1/3 width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Inquiries</h3>
              <Eye className="w-5 h-5 text-gray-500" />
            </div>
            
            <div className="space-y-3">
              {recentInquiries.map((inquiry, index) => (
                <div key={inquiry.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {inquiry.name}
                      </p>
                    </div>
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                      inquiry.status === 'resolved' || inquiry.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        : inquiry.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 truncate mb-1">
                    {inquiry.reason}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {inquiry.email}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Link 
                href="/admin/inquiries"
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              >
                View All
                <ArrowUpRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </AdminGuard>
    </DashboardLayout>
  );
}
