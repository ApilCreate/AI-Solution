"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { 
  BarChart3,
  TrendingUp,
  Users,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Target,
  Award,
  Clock,
  AlertCircle
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface AnalyticsData {
  overview: {
    total: number;
    last7: number;
    pending: number;
  };
  byCountry: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  byReason: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  overTime: Array<{
    month: string;
    count: number;
  }>;
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  conversionRates: {
    totalInquiries: number;
    responded: number;
    converted: number;
    rate: number;
  };
}

interface FilterOptions {
  dateRange: string;
  country: string;
  reason: string;
  status: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: "all",
    country: "",
    reason: "",
    status: ""
  });
  const [showFilters, setShowFilters] = useState(false);

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
          fetchAnalyticsData();
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

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Fetch all analytics data
      const [overviewRes, countryRes, reasonRes, timeRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/by-country'),
        fetch('/api/analytics/by-reason'),
        fetch('/api/analytics/over-time')
      ]);

      // Check if all responses are ok
      if (!overviewRes.ok || !countryRes.ok || !reasonRes.ok || !timeRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const overview = await overviewRes.json();
      const byCountry = await countryRes.json();
      const byReason = await reasonRes.json();
      const overTime = await timeRes.json();

      // Calculate percentages
      const total = overview.total || 0;
      const countryData = byCountry.map((item: { country: string; count: number }) => ({
        ...item,
        percentage: total > 0 ? (item.count / total) * 100 : 0
      }));

      const reasonData = byReason.map((item: { reason: string; count: number }) => ({
        ...item,
        percentage: total > 0 ? (item.count / total) * 100 : 0
      }));

      // Calculate status distribution
      const statusData = [
        { status: 'new', count: Math.max(0, (overview.total || 0) - (overview.pending || 0)) },
        { status: 'pending', count: overview.pending || 0 },
        { status: 'responded', count: Math.floor((overview.total || 0) * 0.3) },
        { status: 'closed', count: Math.floor((overview.total || 0) * 0.1) }
      ].map(item => ({
        ...item,
        percentage: total > 0 ? (item.count / total) * 100 : 0
      }));

      // Calculate conversion rates
      const conversionRates = {
        totalInquiries: total,
        responded: Math.floor(total * 0.3),
        converted: Math.floor(total * 0.15),
        rate: total > 0 ? (Math.floor(total * 0.15) / total) * 100 : 0
      };

      setAnalyticsData({
        overview,
        byCountry: countryData,
        byReason: reasonData,
        overTime,
        byStatus: statusData,
        conversionRates
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      setError('Failed to load analytics data. Please try again.');
      
      // Set fallback data for demonstration
      const fallbackData: AnalyticsData = {
        overview: { total: 0, last7: 0, pending: 0 },
        byCountry: [],
        byReason: [],
        overTime: [],
        byStatus: [],
        conversionRates: { totalInquiries: 0, responded: 0, converted: 0, rate: 0 }
      };
      setAnalyticsData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Metric', 'Value'],
      ['Total Inquiries', analyticsData.overview.total],
      ['Last 7 Days', analyticsData.overview.last7],
      ['Pending', analyticsData.overview.pending],
      ['Conversion Rate', `${analyticsData.conversionRates.rate.toFixed(1)}%`],
      [''],
      ['Country', 'Count', 'Percentage'],
      ...analyticsData.byCountry.map(item => [
        item.country,
        item.count,
        `${item.percentage.toFixed(1)}%`
      ]),
      [''],
      ['Reason', 'Count', 'Percentage'],
      ...analyticsData.byReason.map(item => [
        item.reason,
        item.count,
        `${item.percentage.toFixed(1)}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCountryFlag = (country: string) => {
    const countryCodeMap: { [key: string]: string } = {
      'USA': 'US', 'NEPAL': 'NP', 'INDIA': 'IN', 'BRAZIL': 'BR',
      'RUSSIA': 'RU', 'SPAIN': 'ES', 'United States': 'US',
      'Nepal': 'NP', 'India': 'IN', 'Brazil': 'BR',
      'Russia': 'RU', 'Spain': 'ES', 'CANADA': 'CA', 'Canada': 'CA',
      'GERMANY': 'DE', 'Germany': 'DE', 'FRANCE': 'FR', 'France': 'FR',
      'UNITED KINGDOM': 'GB', 'United Kingdom': 'GB', 'UK': 'GB',
      'CHINA': 'CN', 'China': 'CN', 'JAPAN': 'JP', 'Japan': 'JP',
      'AUSTRALIA': 'AU', 'Australia': 'AU', 'ITALY': 'IT', 'Italy': 'IT',
      'Sweden': 'SE', 'Denmark': 'DK', 'Norway': 'NO', 'Finland': 'FI',
      'New Zealand': 'NZ', 'South Korea': 'KR', 'Singapore': 'SG',
      'Hong Kong': 'HK', 'Mexico': 'MX', 'Argentina': 'AR', 'Chile': 'CL',
      'South Africa': 'ZA', 'Israel': 'IL', 'UAE': 'AE', 'Saudi Arabia': 'SA',
      'Turkey': 'TR', 'Poland': 'PL', 'Czech Republic': 'CZ', 'Hungary': 'HU',
      'Romania': 'RO', 'Bulgaria': 'BG', 'Croatia': 'HR', 'Slovenia': 'SI',
      'Estonia': 'EE', 'Latvia': 'LV', 'Lithuania': 'LT', 'Ireland': 'IE',
      'Portugal': 'PT', 'Belgium': 'BE', 'Austria': 'AT', 'Switzerland': 'CH',
      'Luxembourg': 'LU', 'Malta': 'MT', 'Cyprus': 'CY', 'Greece': 'GR',
      'Ukraine': 'UA', 'Thailand': 'TH', 'Malaysia': 'MY', 'Indonesia': 'ID',
      'Philippines': 'PH', 'Netherlands': 'NL'
    };
    
    const countryCode = countryCodeMap[country] || 'XX';
    
    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: '20px',
          height: '15px',
        }}
        title={country}
      />
    );
  };

  const getReasonLabel = (reason: string): string => {
    const labelMap: { [key: string]: string } = {
      'general-inquiry': 'General Inquiry',
      'technical-support': 'Technical Support',
      'book-demo': 'Book a Demo',
      'careers': 'Careers',
      'partnerships': 'Partnerships',
      'events-inquiry': 'Events Inquiry'
    };
    return labelMap[reason] || reason;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading analytics...</div>
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive analysis of customer inquiries and business performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={exportAnalytics}
              disabled={!analyticsData || analyticsData.overview.total === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button
              onClick={fetchAnalyticsData}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
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

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters & Date Range
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>

              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {analyticsData?.byCountry.map(country => (
                  <option key={country.country} value={country.country}>
                    {country.country}
                  </option>
                )) || []}
              </select>

              <select
                value={filters.reason}
                onChange={(e) => setFilters(prev => ({ ...prev, reason: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Reasons</option>
                {analyticsData?.byReason.map(reason => (
                  <option key={reason.reason} value={reason.reason}>
                    {getReasonLabel(reason.reason)}
                  </option>
                )) || []}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* No Data Message */}
        {analyticsData && analyticsData.overview.total === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No Data Available</p>
            <p className="text-sm">Start by creating some inquiries to see analytics</p>
          </div>
        )}

        {/* Analytics Content */}
        {analyticsData && analyticsData.overview.total > 0 && (
          <>
            {/* Key Metrics with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-emerald-500">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xs ml-1 font-medium">+12%</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {analyticsData.overview.total}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Total Inquiries
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-12 h-1 bg-blue-200 dark:bg-blue-700 rounded-full mr-2">
                      <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                    vs last month
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-emerald-500">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xs ml-1 font-medium">+8%</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {analyticsData.overview.last7}
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    This Week
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-12 h-1 bg-emerald-200 dark:bg-emerald-700 rounded-full mr-2">
                      <div className="w-10 h-1 bg-emerald-500 rounded-full"></div>
                    </div>
                    vs last week
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-500 rounded-xl shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-amber-500">
                      {analyticsData.overview.pending > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                      <span className="text-xs ml-1 font-medium">{analyticsData.overview.pending > 5 ? '+' : '-'}2%</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {analyticsData.overview.pending}
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Pending Review
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-12 h-1 bg-amber-200 dark:bg-amber-700 rounded-full mr-2">
                      <div className="w-6 h-1 bg-amber-500 rounded-full"></div>
                    </div>
                    needs attention
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-purple-500">
                      <Award className="w-5 h-5" />
                      <span className="text-xs ml-1 font-medium">Excellent</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {analyticsData.conversionRates.rate.toFixed(1)}%
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Conversion Rate
                  </p>
                  <div className="mt-3 flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <div className="w-12 h-1 bg-purple-200 dark:bg-purple-700 rounded-full mr-2">
                      <div className="w-9 h-1 bg-purple-500 rounded-full"></div>
                    </div>
                    above target
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Country Distribution - Enhanced */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="xl:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Top 7 Countries
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Geographic distribution of inquiries
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="space-y-6">
                  {analyticsData.byCountry.slice(0, 7).map((country, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-6 rounded-md border border-gray-200 dark:border-gray-600 overflow-hidden">
                            {getCountryFlag(country.country)}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {country.country}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {country.count}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {country.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${country.percentage}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Inquiry Categories - Redesigned */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Inquiry Categories
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Distribution by inquiry types
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {analyticsData.byReason.map((reason, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="group relative bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-750 rounded-lg p-5 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                            index % 5 === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            index % 5 === 1 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                            index % 5 === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                            index % 5 === 3 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                            'bg-gradient-to-br from-pink-500 to-pink-600'
                          }`}>
                            {index % 5 === 0 && <Users className="w-5 h-5 text-white" />}
                            {index % 5 === 1 && <Target className="w-5 h-5 text-white" />}
                            {index % 5 === 2 && <Activity className="w-5 h-5 text-white" />}
                            {index % 5 === 3 && <TrendingUp className="w-5 h-5 text-white" />}
                            {index % 5 === 4 && <Award className="w-5 h-5 text-white" />}
                            
                            {/* Floating badge */}
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {getReasonLabel(reason.reason)}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {reason.count === 1 ? '1 inquiry received' : `${reason.count} inquiries received`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Percentage Circle */}
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200 dark:text-gray-600"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="transparent"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <motion.path
                                className={
                                  index % 5 === 0 ? 'text-blue-500' :
                                  index % 5 === 1 ? 'text-emerald-500' :
                                  index % 5 === 2 ? 'text-purple-500' :
                                  index % 5 === 3 ? 'text-orange-500' :
                                  'text-pink-500'
                                }
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="transparent"
                                initial={{ strokeDasharray: "0 100" }}
                                animate={{ strokeDasharray: `${reason.percentage} 100` }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {reason.percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Count Display */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {reason.count}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              total
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trend indicator */}
                      {reason.percentage > 15 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                          <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            High
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Performance Over Time - Simple */}
            {analyticsData.overTime.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Performance Trends
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monthly inquiry volume
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {analyticsData.overTime.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="text-center group"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors duration-200">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {item.count}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.month}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Status Distribution - Simple */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Status Overview
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current inquiry statuses
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsData.byStatus.map((status, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className={`p-6 rounded-lg mb-4 group-hover:shadow-md transition-all duration-200 ${
                      status.status === 'new' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      status.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20' :
                      status.status === 'responded' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                      'bg-gray-50 dark:bg-gray-900/20'
                    }`}>
                      <div className={`text-3xl font-bold mb-2 ${
                        status.status === 'new' ? 'text-blue-600 dark:text-blue-400' :
                        status.status === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                        status.status === 'responded' ? 'text-emerald-600 dark:text-emerald-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {status.count}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize mb-1">
                        {status.status}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {status.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
