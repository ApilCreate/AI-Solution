"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Mail,
  Calendar,
  Bell,
  FileText,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: 'Home', href: '/admin/dashboard', icon: Home },
  { name: 'Analysis', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Inquiries', href: '/admin/inquiries', icon: Mail },
  { name: 'Event Management', href: '/admin/events', icon: Calendar },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Blog Management', href: '/admin/blog', icon: FileText },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(2);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-70 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                AI SOLUTIONS
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-70">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumbs */}
              <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Home</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {navigationItems.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
                </span>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* User menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@aisolutions.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
