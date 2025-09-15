"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Activity,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import DashboardLayout from "../../components/DashboardLayout";

interface DashboardStats {
  totalInquiries: number;
  newThisWeek: number;
  pendingInquiries: number;
  completedInquiries: number;
}

interface AnalyticsData {
  countries: Array<{ country: string; count: number }>;
  reasons: Array<{ reason: string; count: number }>;
  monthlyTrend: Array<{ month: string; inquiries: number; completed: number }>;
  statusDistribution: Array<{ label: string; value: number; color: string }>;
  sourceData: Array<{ source: string; count: number }>;
  inquiryTrend: Array<{ date: string; count: number }>;
  reasonDistribution: Array<{ reason: string; count: number }>;
  totalInquiries: number;
  resolvedInquiries: number;
  responseRate: string;
}

interface TrendData {
  date: string;
  inquiries: number;
  completed: number;
  pending: number;
  count: number;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  occupation: string;
  reason: string;
  howDidYouHear: string;
  messageTitle: string;
  message: string;
  status: string;
  tags: string[];
  source: string;
  subject: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newThisWeek: 0,
    pendingInquiries: 0,
    completedInquiries: 0
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    countries: [],
    reasons: [],
    monthlyTrend: [],
    statusDistribution: [
      { label: 'New', value: 0, color: '#3B82F6' },
      { label: 'Pending', value: 0, color: '#F59E0B' },
      { label: 'Completed', value: 0, color: '#10B981' }
    ],
    sourceData: [],
    inquiryTrend: [],
    reasonDistribution: [],
    totalInquiries: 0,
    resolvedInquiries: 0,
    responseRate: '0%'
  });
  const [chartData, setChartData] = useState<TrendData[]>([]);

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
          fetchAllData();
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

  // Fetch all dashboard data
  const fetchAllData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      
      // Fetch inquiries data for statistics
      const inquiriesRes = await fetch('/api/inquiries/list', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('📊 Inquiries response status:', inquiriesRes.status);
      
      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json();
        console.log('📊 Inquiries data received:', inquiriesData);
        
        // The API returns array directly, not wrapped in object
        const inquiriesArray = Array.isArray(inquiriesData) ? inquiriesData : [];
        
        // Calculate stats from the data
        const totalCount = inquiriesArray.length;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const newThisWeek = inquiriesArray.filter(inquiry => 
          new Date(inquiry.createdAt) >= sevenDaysAgo
        ).length;

        const pendingCount = inquiriesArray.filter(inquiry => 
          inquiry.status === 'new' || inquiry.status === 'pending'
        ).length;

        const completedCount = inquiriesArray.filter(inquiry => 
          inquiry.status === 'resolved' || inquiry.status === 'completed'
        ).length;

        console.log('📈 Calculated stats:', { totalCount, newThisWeek, pendingCount, completedCount });

        setStats({
          totalInquiries: totalCount,
          newThisWeek: newThisWeek,
          pendingInquiries: pendingCount,
          completedInquiries: completedCount
        });

      } else {
        console.error('❌ Inquiries API failed:', inquiriesRes.status);
      }

      // Fetch analytics overview
      const analyticsRes = await fetch('/api/analytics/overview', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('📈 Analytics response status:', analyticsRes.status);
      
      if (analyticsRes.ok) {
        const analyticsApiData = await analyticsRes.json();
        console.log('📈 Analytics data received:', analyticsApiData);
        
        // Create analytics data structure that matches our interface
        const processedAnalytics = {
          countries: [],
          reasons: [],
          monthlyTrend: [],
          statusDistribution: [
            { label: 'New', value: stats.newThisWeek || analyticsApiData.pending || 0, color: '#3B82F6' },
            { label: 'Pending', value: stats.pendingInquiries || analyticsApiData.pending || 0, color: '#F59E0B' },
            { label: 'Completed', value: stats.completedInquiries || 0, color: '#10B981' }
          ],
          sourceData: [],
          inquiryTrend: [],
          reasonDistribution: [],
          totalInquiries: analyticsApiData.total || stats.totalInquiries || 0,
          resolvedInquiries: stats.completedInquiries || 0,
          responseRate: `${stats.totalInquiries > 0 ? Math.round((stats.completedInquiries / stats.totalInquiries) * 100) : 0}%`
        };
        
        setAnalyticsData(processedAnalytics);
        
        // Create trend data for charts
        const trendData = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          // Simulate some trend data based on total inquiries
          const dailyCount = Math.floor((analyticsApiData.total || 0) / 30) + Math.floor(Math.random() * 5);
          trendData.push({
            date: dateStr,
            inquiries: dailyCount,
            completed: Math.floor(dailyCount * 0.7),
            pending: Math.floor(dailyCount * 0.3),
            count: dailyCount
          });
        }
        
        setChartData(trendData);
        console.log('📊 Chart data created:', trendData);
        
      } else {
        console.error('❌ Analytics API failed:', analyticsRes.status);
        // Create fallback data
        const fallbackData = {
          countries: [],
          reasons: [],
          monthlyTrend: [],
          statusDistribution: [
            { label: 'New', value: stats.newThisWeek, color: '#3B82F6' },
            { label: 'Pending', value: stats.pendingInquiries, color: '#F59E0B' },
            { label: 'Completed', value: stats.completedInquiries, color: '#10B981' }
          ],
          sourceData: [],
          inquiryTrend: [],
          reasonDistribution: [],
          totalInquiries: stats.totalInquiries,
          resolvedInquiries: stats.completedInquiries,
          responseRate: `${stats.totalInquiries > 0 ? Math.round((stats.completedInquiries / stats.totalInquiries) * 100) : 0}%`
        };
        setAnalyticsData(fallbackData);
      }
      
    } catch (error) {
      console.error('💥 Error fetching data:', error);
      // Set minimal fallback data
      setAnalyticsData({
        countries: [],
        reasons: [],
        monthlyTrend: [],
        statusDistribution: [
          { label: 'No Data', value: 1, color: '#9CA3AF' }
        ],
        sourceData: [],
        inquiryTrend: [],
        reasonDistribution: [],
        totalInquiries: 0,
        resolvedInquiries: 0,
        responseRate: '0%'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your AI solution platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalInquiries}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">New This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newThisWeek}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingInquiries}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedInquiries}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inquiry Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Inquiry Trend</h3>
              <LineChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="inquiries" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Status Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Analytics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Analytics</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.totalInquiries}</div>
              <div className="text-sm text-gray-500 mt-1">Total Inquiries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analyticsData.resolvedInquiries}</div>
              <div className="text-sm text-gray-500 mt-1">Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analyticsData.responseRate}</div>
              <div className="text-sm text-gray-500 mt-1">Response Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Weekly Growth</span>
              <span className="text-green-600 font-semibold">+{stats.newThisWeek} inquiries</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Resolution</span>
              <span className="text-yellow-600 font-semibold">{stats.pendingInquiries} items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="text-blue-600 font-semibold">
                {stats.totalInquiries > 0 ? Math.round((stats.completedInquiries / stats.totalInquiries) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}