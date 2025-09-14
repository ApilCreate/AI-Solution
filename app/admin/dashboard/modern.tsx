"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Mail,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Globe,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react";
import DashboardHeader from "../../components/DashboardHeader";
import ModernStatCard from "../../components/ModernStatCard";
import ModernChart from "../../components/ModernChart";

interface DashboardData {
  totalInquiries: number;
  newThisWeek: number;
  pendingInquiries: number;
  completedInquiries: number;
  countries: Array<{
    country: string;
    count: number;
  }>;
  inquiriesByReason: Array<{
    reason: string;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
  }>;
  recentInquiries: Array<{
    id: string;
    name: string;
    email: string;
    company: string;
    status: string;
    createdAt: string;
  }>;
}

export default function ModernAdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInquiries: 0,
    newThisWeek: 0,
    pendingInquiries: 0,
    completedInquiries: 0,
    countries: [],
    inquiriesByReason: [],
    monthlyTrend: [],
    recentInquiries: []
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
      const [overviewRes, countryRes, reasonRes, timeRes, inquiriesRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/by-country'),
        fetch('/api/analytics/by-reason'),
        fetch('/api/analytics/over-time'),
        fetch('/api/inquiries/list')
      ]);

      if (!overviewRes.ok || !countryRes.ok || !reasonRes.ok || !timeRes.ok || !inquiriesRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [overview, countries, reasons, timeline, inquiries] = await Promise.all([
        overviewRes.json(),
        countryRes.json(),
        reasonRes.json(),
        timeRes.json(),
        inquiriesRes.json()
      ]);

      // Transform data for charts
      const countryData = countries.slice(0, 5).map((item: any) => ({
        country: item.country,
        count: item.count
      }));

      const reasonData = reasons.map((item: any) => ({
        reason: item.reason,
        count: item.count
      }));

      const monthlyData = timeline.map((item: any) => ({
        month: item.period,
        count: item.count
      }));

      setDashboardData({
        totalInquiries: overview.totalInquiries || 0,
        newThisWeek: overview.newThisWeek || 0,
        pendingInquiries: overview.pendingInquiries || 0,
        completedInquiries: overview.completedInquiries || 0,
        countries: countryData,
        inquiriesByReason: reasonData,
        monthlyTrend: monthlyData,
        recentInquiries: inquiries.inquiries?.slice(0, 5) || []
      });

      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Error message */}
        {error && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={itemVariants}
        >
          <ModernStatCard
            title="Total Inquiries"
            value={dashboardData.totalInquiries}
            icon={Mail}
            color="blue"
            change={{ value: "+12% from last month", trend: "up" }}
            index={0}
          />
          <ModernStatCard
            title="New This Week"
            value={dashboardData.newThisWeek}
            icon={Calendar}
            color="green"
            change={{ value: "+5% from last week", trend: "up" }}
            index={1}
          />
          <ModernStatCard
            title="Pending"
            value={dashboardData.pendingInquiries}
            icon={Clock}
            color="orange"
            change={{ value: "2 urgent", trend: "neutral" }}
            index={2}
          />
          <ModernStatCard
            title="Completed"
            value={dashboardData.completedInquiries}
            icon={CheckCircle}
            color="teal"
            change={{ value: "+8% completion rate", trend: "up" }}
            index={3}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Countries Pie Chart */}
          <motion.div variants={itemVariants}>
            <ModernChart
              data={dashboardData.countries.map((item, index) => ({
                label: item.country,
                value: item.count,
                color: `hsl(${index * 60 + 200}, 70%, 50%)`
              }))}
              type="pie"
              title="Inquiries by Country"
            />
          </motion.div>

          {/* Reasons Bar Chart */}
          <motion.div variants={itemVariants}>
            <ModernChart
              data={dashboardData.inquiriesByReason.map(item => ({
                label: item.reason,
                value: item.count
              }))}
              type="bar"
              title="Inquiries by Reason"
            />
          </motion.div>

          {/* Monthly Trend Line Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-1">
            <ModernChart
              data={dashboardData.monthlyTrend.map(item => ({
                label: item.month,
                value: item.count
              }))}
              type="line"
              title="Monthly Trend"
            />
          </motion.div>
        </div>

        {/* Recent Inquiries */}
        <motion.div
          className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg"
          variants={itemVariants}
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Inquiries</h3>
          <div className="space-y-4">
            {dashboardData.recentInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {inquiry.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === 'new' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : inquiry.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {inquiry.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
