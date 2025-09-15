'use client';

import React, { useState, useEffect } from 'react';
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
  Activity
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
  color: string;
}

interface CountryData {
  country: string;
  count: number;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch inquiries data
      const inquiriesRes = await fetch('/api/inquiries/list');
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];
        
        // Calculate stats
        const totalCount = inquiries.length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const newThisWeek = inquiries.filter(inquiry => 
          new Date(inquiry.createdAt) >= sevenDaysAgo
        ).length;
        
        const pendingCount = inquiries.filter(inquiry => 
          inquiry.status === 'new' || inquiry.status === 'pending'
        ).length;
        
        const completedCount = inquiries.filter(inquiry => 
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
          
          const monthInquiries = inquiries.filter(inquiry => {
            const inquiryDate = new Date(inquiry.createdAt);
            return inquiryDate >= monthStart && inquiryDate <= monthEnd;
          });
          
          const monthCompleted = monthInquiries.filter(inquiry => 
            inquiry.status === 'resolved' || inquiry.status === 'completed'
          ).length;
          
          const monthPending = monthInquiries.filter(inquiry => 
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
        const reasonCounts = inquiries.reduce((acc: any, inquiry) => {
          const reason = inquiry.reason || 'Other';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {});

        const categories = Object.entries(reasonCounts).map(([name, value], index) => ({
          name,
          value: value as number,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index % 5]
        }));

        // Generate country data based on inquiry countries
        const countryCounts = inquiries.reduce((acc: any, inquiry) => {
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
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Countries Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inquiries by Country</h3>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
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
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
