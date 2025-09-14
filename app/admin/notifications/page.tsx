"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
          fetchNotifications();
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

  const fetchNotifications = async () => {
    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'New Inquiry Received',
        message: 'John Smith from TechCorp Solutions has submitted a new inquiry.',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'System Update',
        message: 'Dashboard has been updated with new analytics features.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
      }
    ];
    
    setNotifications(sampleNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'error': return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      default: return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading notifications...</div>
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
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Stay updated with system alerts and updates
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-xl border ${getNotificationColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-purple-500/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        !notification.read 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        !notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                          Mark as read
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Notifications */}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
