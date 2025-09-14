"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Building,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Grid3X3,
  LineChart,
  List,
  Mail,
  MapPin,
  MessageSquare,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp,
  User,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

        statusDistribution = Object.entries(statusCount)
          .map(([status, count], index) => ({
            label: status,
            value: count as number,
            color: chartColors[index % chartColors.length]
          }));

        // Process source data
        const sourceCount = inquiriesData.reduce((acc: any, inquiry: any) => {
          acc[inquiry.source] = (acc[inquiry.source] || 0) + 1;
          return acc;
        }, {});

        sourceData = Object.entries(sourceCount)
          .map(([source, count], index) => ({
            label: source,
            value: count as number,
            color: chartColors[index % chartColors.length]
          }));
      }

      // Set chart data from API responses
      setChartData({
        countries,
        reasons,
        monthlyTrend,
        statusDistribution,
        sourceData
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
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
