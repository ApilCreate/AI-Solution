"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  FileText, 
  Settings, 
  LogOut, 
  Shield, 
  Sparkles,
  Bell,
  Search,
  Clock
} from "lucide-react";
import { GlassCard } from "../../components/ui";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    loginTime: "",
    sessionDuration: ""
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuthenticated");
      const loginTime = localStorage.getItem("adminLoginTime");
      
      if (authStatus === "true" && loginTime) {
        const loginTimestamp = parseInt(loginTime);
        const currentTime = Date.now();
        const sessionDuration = currentTime - loginTimestamp;
        
        // Session expires after 24 hours (86400000 ms)
        if (sessionDuration < 86400000) {
          setIsAuthenticated(true);
          setAdminInfo({
            loginTime: new Date(loginTimestamp).toLocaleString(),
            sessionDuration: formatDuration(sessionDuration)
          });
        } else {
          // Session expired
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

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminLoginTime");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05010D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-[#05010D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-xl bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                  AI Solutions
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/20"></div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Admin Dashboard</span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                <Search className="w-5 h-5 text-gray-300" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-gray-300">
                Manage your AI Solutions platform from this central hub
              </p>
            </div>
            <GlassCard padding="md" className="w-fit">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-gray-300">Session: {adminInfo.sessionDuration}</div>
                  <div className="text-gray-400 text-xs">Login: {adminInfo.loginTime}</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <GlassCard padding="lg">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-purple-400" />
                Navigation
              </h2>
              <nav className="space-y-2">
                {[
                  { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", active: true },
                  { icon: <Mail className="w-4 h-4" />, label: "Contact Messages", count: 12 },
                  { icon: <FileText className="w-4 h-4" />, label: "Blog Management" },
                  { icon: <Users className="w-4 h-4" />, label: "User Management" },
                  { icon: <Settings className="w-4 h-4" />, label: "Settings" }
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                      item.active 
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/30 text-purple-300">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </GlassCard>
          </motion.div>

          {/* Main Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Total Contacts",
                    value: "127",
                    change: "+12%",
                    icon: <Mail className="w-6 h-6" />,
                    color: "purple"
                  },
                  {
                    title: "Blog Posts",
                    value: "8",
                    change: "+2",
                    icon: <FileText className="w-6 h-6" />,
                    color: "blue"
                  },
                  {
                    title: "Active Sessions",
                    value: "1",
                    change: "Current",
                    icon: <Users className="w-6 h-6" />,
                    color: "green"
                  }
                ].map((stat, index) => (
                  <GlassCard key={index} padding="lg" hover>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className={`text-sm text-${stat.color}-400 mt-1`}>{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                        {stat.icon}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Coming Soon Section */}
              <GlassCard padding="lg">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                    <Settings className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Dashboard Under Development
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    This admin dashboard is currently being built. More features and 
                    management tools will be available soon.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                    <Clock className="w-4 h-4" />
                    Coming Soon
                  </div>
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard padding="lg">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { 
                      title: "View Contact Messages", 
                      description: "Review and respond to customer inquiries",
                      icon: <Mail className="w-5 h-5" />
                    },
                    { 
                      title: "Manage Blog Posts", 
                      description: "Create, edit, and publish blog content",
                      icon: <FileText className="w-5 h-5" />
                    },
                    { 
                      title: "System Settings", 
                      description: "Configure platform settings and preferences",
                      icon: <Settings className="w-5 h-5" />
                    },
                    { 
                      title: "User Analytics", 
                      description: "View user engagement and platform metrics",
                      icon: <Users className="w-5 h-5" />
                    }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors duration-200">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-white mb-1">{action.title}</h4>
                          <p className="text-gray-400 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
