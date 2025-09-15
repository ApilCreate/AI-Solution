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

<<<<<<< HEAD
export default function AdminDashboard() {
=======
const ModernChart = ({ data, type, title }: { data: any[], type: ChartType, title: string }) => {
  console.log('Chart data:', { title, type, data }); // Debug log

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>
        <div className="flex items-center justify-center h-64 text-slate-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return <div className="flex items-center justify-center h-64 text-slate-500">No data to display</div>;

    let currentAngle = 0;
    const centerX = 120;
    const centerY = 120;
    const radius = 80;

    return (
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-4">
        <div className="relative">
          <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">
            <defs>
              {data.map((_, index) => (
                <linearGradient key={index} id={`pieGradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={`hsl(${index * 45 + 200}, 70%, 60%)`} />
                  <stop offset="100%" stopColor={`hsl(${index * 45 + 200}, 70%, 45%)`} />
                </linearGradient>
              ))}
            </defs>
            
            {/* Background circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 5}
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="2"
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              
              // Calculate arc path
              const startAngleRad = (currentAngle - 90) * Math.PI / 180;
              const endAngleRad = (currentAngle + angle - 90) * Math.PI / 180;
              
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                "M", centerX, centerY,
                "L", x1, y1,
                "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
                "Z"
              ].join(" ");

              currentAngle += angle;

              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={`url(#pieGradient${index})`}
                  stroke="white"
                  strokeWidth="3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                  className="cursor-pointer"
                />
              );
            })}
            
            {/* Center circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r="25"
              fill="white"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Total count in center */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-lg font-bold fill-slate-700 dark:fill-slate-300"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              className="text-xs fill-slate-500"
            >
              Total
            </text>
          </svg>
        </div>
        
        <div className="space-y-3 min-w-0 flex-1">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, hsl(${index * 45 + 200}, 70%, 60%), hsl(${index * 45 + 200}, 70%, 45%))` 
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.value} ({percentage}%)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value || 0));
    if (maxValue === 0) return <div className="flex items-center justify-center h-64 text-slate-500">No data to display</div>;
    
    return (
      <div className="space-y-6 p-4">
        {data.slice(0, 8).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[60%]">
                {item.label}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {item.value}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, hsl(${index * 30 + 200}, 70%, 55%), hsl(${index * 30 + 220}, 70%, 65%))`
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>
              {/* Percentage label */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {((item.value / maxValue) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    if (data.length < 2) return <div className="flex items-center justify-center h-64 text-slate-500">Need at least 2 data points</div>;
    
    const maxValue = Math.max(...data.map(d => d.value || 0));
    const minValue = Math.min(...data.map(d => d.value || 0));
    const range = maxValue - minValue || 1;
    const padding = 50;
    const chartWidth = 400;
    const chartHeight = 250;

    return (
      <div className="relative h-80 p-4">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.05)" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i * (chartHeight - 2 * padding) / 4)}
              x2={chartWidth - padding}
              y2={padding + (i * (chartHeight - 2 * padding) / 4)}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Y-axis labels */}
          {Array.from({ length: 5 }).map((_, i) => {
            const value = maxValue - (i * range / 4);
            return (
              <text
                key={i}
                x={padding - 10}
                y={padding + (i * (chartHeight - 2 * padding) / 4) + 5}
                textAnchor="end"
                className="text-xs fill-slate-500"
              >
                {Math.round(value)}
              </text>
            );
          })}
          
          {/* Area fill */}
          <motion.polygon
            fill="url(#lineGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            points={`
              ${padding},${chartHeight - padding} 
              ${data.map((item, index) => {
                const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
                const y = chartHeight - padding - ((item.value - minValue) / range * (chartHeight - 2 * padding));
                return `${x},${y}`;
              }).join(' ')} 
              ${chartWidth - padding},${chartHeight - padding}
            `}
          />
          
          {/* Data line */}
          <motion.polyline
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            points={data.map((item, index) => {
              const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
              const y = chartHeight - padding - ((item.value - minValue) / range * (chartHeight - 2 * padding));
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
            const y = chartHeight - padding - ((item.value - minValue) / range * (chartHeight - 2 * padding));
            return (
              <motion.g key={index}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="white"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  filter="url(#glow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.5 }}
                  className="cursor-pointer"
                />
                {/* Tooltip on hover */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="pointer-events-none"
                >
                  <rect
                    x={x - 25}
                    y={y - 35}
                    width="50"
                    height="25"
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="4"
                  />
                  <text
                    x={x}
                    y={y - 18}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                  >
                    {item.value}
                  </text>
                </motion.g>
              </motion.g>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = padding + (index * (chartWidth - 2 * padding) / (data.length - 1));
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - padding + 20}
                textAnchor="middle"
                className="text-xs fill-slate-600 font-medium"
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>
      {type === 'pie' && renderPieChart()}
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
    </div>
  );
};

export default function ModernAdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
>>>>>>> e0b6c1ea6f829b548fb9a10467f0143d2a16a959
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
<<<<<<< HEAD
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
=======
      const [inquiriesRes, statsRes, countriesRes, reasonsRes, timeRes] = await Promise.all([
        fetch('/api/inquiries/list'),
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/by-country'),
        fetch('/api/analytics/by-reason'),
        fetch('/api/analytics/over-time')
      ]);

      let inquiriesData: any[] = [];

      if (inquiriesRes.ok) {
        inquiriesData = await inquiriesRes.json();
        console.log('Inquiries data:', inquiriesData); // Debug log
        setInquiries(inquiriesData || []);
      } else {
        console.error('Failed to fetch inquiries:', inquiriesRes.status);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData); // Debug log
        setStats({
          totalInquiries: statsData.total || 0,
          newThisWeek: statsData.last7 || 0,
          pendingInquiries: statsData.pending || 0,
          completedInquiries: (statsData.total || 0) - (statsData.pending || 0)
        });
      } else {
        console.error('Failed to fetch stats:', statsRes.status);
      }

      // Process analytics data for charts
      let countries: Array<{ label: string; value: number; color?: string }> = [];
      let reasons: Array<{ label: string; value: number; color?: string }> = [];
      let monthlyTrend: Array<{ label: string; value: number; date: string }> = [];
      let statusDistribution: Array<{ label: string; value: number; color?: string }> = [];
      let sourceData: Array<{ label: string; value: number; color?: string }> = [];

      if (countriesRes.ok) {
        const countriesData = await countriesRes.json();
        console.log('Countries data:', countriesData); // Debug log
        countries = countriesData.map((item: any, index: number) => ({
          label: item.country || 'Unknown',
          value: item.count,
          color: chartColors[index % chartColors.length]
        }));
      }

      if (reasonsRes.ok) {
        const reasonsData = await reasonsRes.json();
        console.log('Reasons data:', reasonsData); // Debug log
        reasons = reasonsData.map((item: any, index: number) => ({
          label: item.reason,
          value: item.count,
          color: chartColors[index % chartColors.length]
        }));
      }

      if (timeRes.ok) {
        const timeData = await timeRes.json();
        console.log('Time data:', timeData); // Debug log
        monthlyTrend = timeData.map((item: any) => ({
          label: item.month,
          value: item.count,
          date: item.month
        }));
      }

      // Process status and source data from inquiries (using already fetched data)
      if (inquiriesData.length > 0) {
        // Process status distribution
        const statusCount = inquiriesData.reduce((acc: any, inquiry: any) => {
          acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
          return acc;
        }, {});
>>>>>>> e0b6c1ea6f829b548fb9a10467f0143d2a16a959

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
