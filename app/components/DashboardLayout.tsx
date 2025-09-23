"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  IconHome,
  IconChartBar,
  IconMail,
  IconCalendar,
  IconFileText,
  IconLogout,
  IconSearch,
  IconSettings
} from '@tabler/icons-react';
import ThemeToggle from './ui/ThemeToggle';
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '../../components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { 
    label: 'Home', 
    href: '/admin/dashboard', 
    icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
  { 
    label: 'Analytics', 
    href: '/admin/analytics', 
    icon: <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
  { 
    label: 'Inquiries', 
    href: '/admin/inquiries', 
    icon: <IconMail className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
  { 
    label: 'Events', 
    href: '/admin/events', 
    icon: <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
  { 
    label: 'Blog', 
    href: '/admin/blog', 
    icon: <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
  { 
    label: 'Settings', 
    href: '/admin/settings', 
    icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
  },
];

const UserSection = ({ handleLogout }: { handleLogout: () => void }) => {
  const { open } = useSidebar();
  
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      {/* Logout Button */}
      <div className="relative">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-2 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          title={!open ? "Log out" : ""}
        >
          <div className="flex items-center justify-center min-w-[24px]">
            <IconLogout className="h-5 w-5 shrink-0" />
          </div>
          <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
            open ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}>
            Log out
          </span>
        </button>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      // Clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Clear client-side storage
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    
    // Redirect to login
    router.push('/admin/login');
  };

  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getCurrentPageName = () => {
    const currentItem = navigationItems.find(item => isActiveRoute(item.href));
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-2 h-screen transition-colors duration-300">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-4">
            {/* Logo */}
            <div className="flex items-center gap-3 py-2 px-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className={`font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap transition-all duration-200 overflow-hidden ${
                open ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}>
                AI SOLUTIONS
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 flex-1">
              {navigationItems.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={`transition-all duration-200 ${
                    isActiveRoute(link.href)
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <UserSection handleLogout={handleLogout} />
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side - Breadcrumbs */}
            <div className="flex items-center gap-4">
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Home</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {getCurrentPageName()}
                </span>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                <IconSearch className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-48"
                />
              </div>

              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
