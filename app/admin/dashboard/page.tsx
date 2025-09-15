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
  Bar,
  Legend
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
  date: string;
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

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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

        const responseRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        setStats({
          totalInquiries: totalCount,
          newThisWeek,
          pendingInquiries: pendingCount,
          completedInquiries: completedCount,
          responseRate: `${responseRate}%`,
          avgResponseTime: '2.4h'
        });

        // Generate chart data for the last 12 months
        const chartData: ChartData[] = [];
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          
          const monthInquiries = inquiries.filter(inquiry => {
            const inquiryDate = new Date(inquiry.createdAt);
            return inquiryDate.getMonth() === date.getMonth() && 
                   inquiryDate.getFullYear() === date.getFullYear();
          });

          chartData.push({
            date: monthStr,
            inquiries: monthInquiries.length,
            completed: monthInquiries.filter(i => i.status === 'resolved' || i.status === 'completed').length,
            pending: monthInquiries.filter(i => i.status === 'new' || i.status === 'pending').length
          });
        }
        setChartData(chartData);

        // Generate category data
        const categoryMap = new Map();
        inquiries.forEach(inquiry => {
          const category = inquiry.reason || 'General';
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        const categories: CategoryData[] = Array.from(categoryMap.entries()).map(([name, value], index) => ({
          name,
          value: value as number,
          color: COLORS[index % COLORS.length]
        }));
        setCategoryData(categories);

        // Generate country data
        const countryMap = new Map();
        inquiries.forEach(inquiry => {
          const country = inquiry.country || 'Unknown';
          countryMap.set(country, (countryMap.get(country) || 0) + 1);
        });

        const countries: CountryData[] = Array.from(countryMap.entries())
          .map(([country, count]) => ({ country, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setCountryData(countries);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendDirection = 'up',
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    trendDirection?: 'up' | 'down';
    color?: 'blue' | 'green' | 'yellow' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {trendDirection === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your AI solution platform</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Inquiries"
            value={stats.totalInquiries}
            icon={MessageSquare}
            trend="+12% from last week"
            color="blue"
          />
          <StatCard
            title="New This Week"
            value={stats.newThisWeek}
            icon={Calendar}
            trend="+8% from last week"
            color="green"
          />
          <StatCard
            title="Pending"
            value={stats.pendingInquiries}
            icon={Clock}
            trend="-5% from last week"
            trendDirection="down"
            color="yellow"
          />
          <StatCard
            title="Completed"
            value={stats.completedInquiries}
            icon={CheckCircle}
            trend="+15% from last week"
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inquiry Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Inquiry Trend</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Inquiry Categories</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No category data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Response Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-gray-900">{stats.responseRate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Response Time</span>
                <span className="font-semibold text-gray-900">{stats.avgResponseTime}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: stats.responseRate }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Top Countries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            {countryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={countryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="country" type="category" stroke="#666" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500">
                No country data available
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
