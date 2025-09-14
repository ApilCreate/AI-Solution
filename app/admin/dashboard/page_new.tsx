"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Globe,
  Calendar,
  FileText,
  AlertCircle,
  Filter,
  Download,
  Search,
  Eye,
  MoreHorizontal,
  ChevronDown,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Grid3X3,
  List,
  Settings,
  X,
  User,
  Building,
  MapPin,
  MessageSquare
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  occupation?: string;
  reason: string;
  howDidYouHear?: string;
  messageTitle: string;
  message: string;
  status: string;
  tags?: string[];
  source: string;
  createdAt: string;
}

interface DashboardStats {
  totalInquiries: number;
  newThisWeek: number;
  pendingInquiries: number;
  completedInquiries: number;
}

interface ChartData {
  countries: Array<{ label: string; value: number; color?: string }>;
  reasons: Array<{ label: string; value: number; color?: string }>;
  monthlyTrend: Array<{ label: string; value: number; date: string }>;
  statusDistribution: Array<{ label: string; value: number; color?: string }>;
  sourceData: Array<{ label: string; value: number; color?: string }>;
}

type ViewMode = 'grid' | 'list';
type ChartType = 'pie' | 'bar' | 'line';

const StatCard = ({ icon: Icon, title, value, change, color = "blue", isLoading = false }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
        {isLoading ? (
          <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mt-2" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
        )}
        {change && (
          <p className={`text-sm mt-1 ${change.trend === 'up' ? 'text-green-600' : change.trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
            {change.value}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
    </div>
  </motion.div>
);

const ModernChart = ({ data, type, title }: { data: any[], type: ChartType, title: string }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">{title}</h3>
        <div className="flex items-center justify-center h-64 text-slate-500">
          No data available
        </div>
      </div>
    );
  }

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center gap-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
              const x2 = 100 + 80 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                "M", 100, 100,
                "L", x1, y1,
                "A", 80, 80, 0, largeArcFlag, 1, x2, y2,
                "Z"
              ].join(" ");

              const color = item.color || `hsl(${index * 60 + 200}, 70%, 50%)`;
              currentAngle += angle;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color || `hsl(${index * 60 + 200}, 70%, 50%)` }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="relative h-64">
        <svg width="100%" height="100%" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="40"
              y1={40 + (i * 32)}
              x2="360"
              y2={40 + (i * 32)}
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
            />
          ))}
          
          {/* Area fill */}
          <polygon
            fill="url(#gradient)"
            points={`40,180 ${data.map((item, index) => {
              const x = 40 + (index * (320 / (data.length - 1)));
              const y = 180 - ((item.value - minValue) / range * 140);
              return `${x},${y}`;
            }).join(' ')} 360,180`}
          />
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            points={data.map((item, index) => {
              const x = 40 + (index * (320 / (data.length - 1)));
              const y = 180 - ((item.value - minValue) / range * 140);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = 40 + (index * (320 / (data.length - 1)));
            const y = 180 - ((item.value - minValue) / range * 140);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="2"
              />
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
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newThisWeek: 0,
    pendingInquiries: 0,
    completedInquiries: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    countries: [],
    reasons: [],
    monthlyTrend: [],
    statusDistribution: [],
    sourceData: []
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    country: '',
    reason: '',
    source: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // UI states
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeChart, setActiveChart] = useState<ChartType>('pie');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Colors for charts
  const chartColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [filters, inquiries]);

  const checkAuth = async () => {
    try {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        if (sessionDuration < 86400000) { // 24 hours
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          localStorage.removeItem("adminUser");
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [inquiriesRes, statsRes] = await Promise.all([
        fetch('/api/inquiries/list'),
        fetch('/api/analytics/overview')
      ]);

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        setInquiries(inquiriesData.inquiries || []);
        processChartData(inquiriesData.inquiries || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processChartData = (inquiriesData: Inquiry[]) => {
    // Process countries
    const countryCount = inquiriesData.reduce((acc, inquiry) => {
      const country = inquiry.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countries = Object.entries(countryCount)
      .map(([country, count], index) => ({
        label: country,
        value: count,
        color: chartColors[index % chartColors.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Process reasons
    const reasonCount = inquiriesData.reduce((acc, inquiry) => {
      acc[inquiry.reason] = (acc[inquiry.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reasons = Object.entries(reasonCount)
      .map(([reason, count], index) => ({
        label: reason,
        value: count,
        color: chartColors[index % chartColors.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Process monthly trend
    const monthlyCount = inquiriesData.reduce((acc, inquiry) => {
      const date = new Date(inquiry.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { count: 0, month: monthName, date: monthKey };
      }
      acc[monthKey].count++;
      return acc;
    }, {} as Record<string, { count: number; month: string; date: string }>);

    const monthlyTrend = Object.values(monthlyCount)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        label: item.month,
        value: item.count,
        date: item.date
      }));

    // Process status distribution
    const statusCount = inquiriesData.reduce((acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusDistribution = Object.entries(statusCount)
      .map(([status, count], index) => ({
        label: status,
        value: count,
        color: chartColors[index % chartColors.length]
      }));

    // Process source data
    const sourceCount = inquiriesData.reduce((acc, inquiry) => {
      acc[inquiry.source] = (acc[inquiry.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceData = Object.entries(sourceCount)
      .map(([source, count], index) => ({
        label: source,
        value: count,
        color: chartColors[index % chartColors.length]
      }));

    setChartData({
      countries,
      reasons,
      monthlyTrend,
      statusDistribution,
      sourceData
    });
  };

  const applyFilters = () => {
    let filtered = [...inquiries];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchLower) ||
        inquiry.email.toLowerCase().includes(searchLower) ||
        inquiry.company?.toLowerCase().includes(searchLower) ||
        inquiry.messageTitle.toLowerCase().includes(searchLower) ||
        inquiry.message.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(inquiry => inquiry.status === filters.status);
    }

    if (filters.country) {
      filtered = filtered.filter(inquiry => inquiry.country === filters.country);
    }

    if (filters.reason) {
      filtered = filtered.filter(inquiry => inquiry.reason === filters.reason);
    }

    if (filters.source) {
      filtered = filtered.filter(inquiry => inquiry.source === filters.source);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(inquiry => 
        new Date(inquiry.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(inquiry => 
        new Date(inquiry.createdAt) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    setFilteredInquiries(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'Company', 'Country', 'Occupation',
      'Reason', 'How Did You Hear', 'Message Title', 'Message', 'Status',
      'Source', 'Created At'
    ];

    const csvData = filteredInquiries.map(inquiry => [
      inquiry.id,
      inquiry.name,
      inquiry.email,
      inquiry.phone || '',
      inquiry.company || '',
      inquiry.country || '',
      inquiry.occupation || '',
      inquiry.reason,
      inquiry.howDidYouHear || '',
      inquiry.messageTitle,
      inquiry.message.replace(/"/g, '""'), // Escape quotes
      inquiry.status,
      inquiry.source,
      new Date(inquiry.createdAt).toLocaleString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUniqueValues = (field: keyof Inquiry) => {
    return [...new Set(inquiries.map(inquiry => inquiry[field]).filter(Boolean))];
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      country: '',
      reason: '',
      source: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Welcome to your admin dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchData}
              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </motion.button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      placeholder="Search inquiries..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {getUniqueValues('status').map(status => (
                      <option key={status as string} value={status as string}>{status as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {getUniqueValues('country').map(country => (
                      <option key={country as string} value={country as string}>{country as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason
                  </label>
                  <select
                    value={filters.reason}
                    onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Reasons</option>
                    {getUniqueValues('reason').map(reason => (
                      <option key={reason as string} value={reason as string}>{reason as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Mail}
            title="Total Inquiries"
            value={stats.totalInquiries}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            icon={TrendingUp}
            title="New This Week"
            value={stats.newThisWeek}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={stats.pendingInquiries}
            color="yellow"
            isLoading={isLoading}
          />
          <StatCard
            icon={CheckCircle}
            title="Completed"
            value={stats.completedInquiries}
            color="green"
            isLoading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Inquiries by Country
              </h2>
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                {(['pie', 'bar', 'line'] as ChartType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveChart(type)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeChart === type
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {type === 'pie' && <PieChart className="w-4 h-4" />}
                    {type === 'bar' && <BarChart3 className="w-4 h-4" />}
                    {type === 'line' && <LineChart className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
            <ModernChart 
              data={chartData.countries} 
              type={activeChart} 
              title="By Country" 
            />
          </div>

          <ModernChart 
            data={chartData.reasons} 
            type="pie" 
            title="Inquiries by Reason" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModernChart 
            data={chartData.monthlyTrend} 
            type="line" 
            title="Monthly Trend" 
          />
          <ModernChart 
            data={chartData.statusDistribution} 
            type="pie" 
            title="Status Distribution" 
          />
        </div>

        {/* Inquiries Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Recent Inquiries ({filteredInquiries.length})
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          {inquiry.name}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{inquiry.email}</span>
                      </div>
                      {inquiry.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{inquiry.company}</span>
                        </div>
                      )}
                      {inquiry.country && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span>{inquiry.country}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        <span className="truncate">{inquiry.reason}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {inquiry.messageTitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Country</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Reason</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inquiry) => (
                      <motion.tr
                        key={inquiry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="py-3 px-4 text-slate-900 dark:text-white">{inquiry.name}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inquiry.email}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inquiry.company || '-'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inquiry.country || '-'}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{inquiry.reason}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedInquiry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Inquiry Details
                </h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Name
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Company
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.company || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Country
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.country || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Occupation
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.occupation || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Reason
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.reason}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      How did you hear about us?
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.howDidYouHear || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Status
                    </label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedInquiry.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      selectedInquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Source
                    </label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.source}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message Title
                  </label>
                  <p className="text-slate-900 dark:text-white">{selectedInquiry.messageTitle}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Created At
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
