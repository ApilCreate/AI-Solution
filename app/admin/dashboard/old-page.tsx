"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  RefreshCw,
  TrendingUp,
  Clock,
  Mail,
  Users,
  Calendar,
  BarChart3,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import DashboardCard from "../../components/ui/DashboardCard";
import CountryCard from "../../components/ui/CountryCard";
import PerformanceChart from "../../components/ui/PerformanceChart";

interface DashboardData {
  totalInquiries: number;
  newThisWeek: number;
  pendingInquiries: number;
  countries: Array<{
    country: string;
    count: number;
    flag: string;
    percentage: number;
  }>;
  performance: Array<{
    month: string;
    value: number;
  }>;
  recentEntries: Array<{
    id: string;
    name: string;
    company: string;
    reason: string;
    date: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInquiries: 0,
    newThisWeek: 0,
    pendingInquiries: 0,
    countries: [],
    performance: [],
    recentEntries: []
  });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        if (sessionDuration < 86400000) { // 24 hours
          setIsAuthenticated(true);
          fetchDashboardData();
        } else {
          // Session expired
          localStorage.removeItem("adminAuthenticated");
          localStorage.removeItem("adminLoginTime");
          localStorage.removeItem("adminUser");
          router.push("/admin/login");
        }
      } else {
        router.push("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setIsRefreshing(true);

      // Fetch all dashboard data
      const [overviewRes, countryRes, timeRes, inquiriesRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/by-country'),
        fetch('/api/analytics/over-time'),
        fetch('/api/inquiries/list')
      ]);

      // Check if all responses are ok
      if (!overviewRes.ok || !countryRes.ok || !timeRes.ok || !inquiriesRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const overviewData = await overviewRes.json();
      const countryData = await countryRes.json();
      const timeData = await timeRes.json();
      const inquiriesData = await inquiriesRes.json();

      // Process country data
      const total = overviewData.total || 0;
      const countries = countryData.map((item: { country: string; count: number }) => ({
        country: item.country,
        count: item.count,
        flag: getCountryFlag(item.country),
        percentage: total > 0 ? (item.count / total) * 100 : 0
      }));

      // Process performance data
      const performance = timeData.map((item: { month: string; count: number }) => ({
        month: item.month,
        value: item.count
      }));

      // Process recent entries
      const recentEntries = inquiriesData.slice(0, 5).map((inquiry: {
        id: string;
        name: string;
        company: string | null;
        reason: string;
        createdAt: string;
        status: string;
      }) => ({
        id: inquiry.id,
        name: inquiry.name,
        company: inquiry.company || 'N/A',
        reason: inquiry.reason,
        date: new Date(inquiry.createdAt).toLocaleDateString(),
        status: inquiry.status
      }));

      setDashboardData({
        totalInquiries: overviewData.total || 0,
        newThisWeek: overviewData.last7 || 0,
        pendingInquiries: overviewData.pending || 0,
        countries,
        performance,
        recentEntries
      });

      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set fallback data for demonstration
      const fallbackData: DashboardData = {
        totalInquiries: 0,
        newThisWeek: 0,
        pendingInquiries: 0,
        countries: [],
        performance: [],
        recentEntries: []
      };
      setDashboardData(fallbackData);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCountryFlag = (country: string): string => {
    const flagMap: { [key: string]: string } = {
      'USA': '🇺🇸',
      'NEPAL': '🇳🇵',
      'INDIA': '🇮🇳',
      'BRAZIL': '🇧🇷',
      'RUSSIA': '🇷🇺',
      'SPAIN': '🇪🇸',
      'United States': '🇺🇸',
      'Nepal': '🇳🇵',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Russia': '🇷🇺',
      'Spain': '🇪🇸'
    };
    return flagMap[country] || '🌍';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here&apos;s what&apos;s happening with your inquiries.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated: {lastUpdated || 'Never'}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {dashboardData.totalInquiries === 0 && !error && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No Data Available</p>
            <p className="text-sm">Start by creating some inquiries to see dashboard data</p>
          </div>
        )}

        {/* Dashboard Content */}
        {dashboardData.totalInquiries > 0 && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="TOTAL INQUIRIES"
                value={dashboardData.totalInquiries}
                icon={Mail}
                trend={{ value: 12, isPositive: true, label: "vs last month" }}
              />
              
              <DashboardCard
                title="THIS WEEK'S NEW INQUIRIES"
                value={dashboardData.newThisWeek}
                icon={TrendingUp}
                trend={{ value: 8, isPositive: true, label: "vs last week" }}
              />
              
              <DashboardCard
                title="PENDING INQUIRIES"
                value={dashboardData.pendingInquiries}
                icon={Clock}
                trend={{ value: -3, isPositive: false, label: "vs yesterday" }}
              />
            </div>

            {/* Top Inquiries by Country */}
            {dashboardData.countries.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    TOP INQUIRIES BY COUNTRY
                  </h3>
                  <a href="/admin/analytics" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                    See All
                  </a>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {dashboardData.countries.slice(0, 6).map((country, index) => (
                    <CountryCard
                      key={index}
                      country={country.country}
                      count={country.count}
                      flag={country.flag}
                      percentage={country.percentage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Performance Overview and Recent Entries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData.performance.length > 0 && (
                <PerformanceChart data={dashboardData.performance} />
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    RECENT ENTRIES
                  </h3>
                  <a href="/admin/inquiries" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                    See All
                  </a>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentEntries.length > 0 ? (
                    dashboardData.recentEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{entry.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{entry.reason}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{entry.date}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                            {entry.status}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No recent inquiries</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
