'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import ChangePassword from '@/app/components/ChangePassword';
import ActivityLog from '@/app/components/ActivityLog';
import { 
  Settings, 
  Shield, 
  Activity, 
  User,
  ArrowLeft
} from 'lucide-react';

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('password');
  const [adminUser, setAdminUser] = useState<{ id: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // Get admin user data from localStorage
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      try {
        setAdminUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse admin user data:', error);
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const tabs = [
    {
      id: 'password',
      label: 'Change Password',
      icon: Shield,
      description: 'Update your account password'
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: Activity,
      description: 'View your account activity'
    }
  ];

  const handlePasswordChanged = () => {
    // Optionally refresh activity log or show success message
    if (activeTab !== 'activity') {
      setActiveTab('activity');
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#05010D] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your account settings and view activity
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span>{adminUser.email}</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                      ${isActive
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'password' && (
                <ChangePassword 
                  userEmail={adminUser.email} 
                  onPasswordChanged={handlePasswordChanged}
                />
              )}
              
              {activeTab === 'activity' && (
                <ActivityLog adminId={adminUser.id} />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}