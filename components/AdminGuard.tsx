'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Immediate client-side check for faster redirect
    const quickCheck = () => {
      const adminUser = localStorage.getItem('adminUser');
      const isAuth = localStorage.getItem('adminAuthenticated');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (!adminUser || !isAuth || isAuth !== 'true' || !loginTime) {
        // No valid local session, redirect immediately
        router.replace('/admin/login');
        return false;
      }
      
      // Check if session is expired
      const loginTimestamp = parseInt(loginTime);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
      
      if (currentTime - loginTimestamp >= sessionDuration) {
        // Session expired, clear and redirect
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        router.replace('/admin/login');
        return false;
      }
      
      return true;
    };

    // If quick check fails, don't proceed with server validation
    if (!quickCheck()) {
      setIsLoading(false);
      return;
    }

    const checkAuthentication = async () => {
      try {
        // Server-side session validation
        const sessionRes = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.isAuthenticated && sessionData.user) {
            setIsAuthenticated(true);
            setUserEmail(sessionData.user.email);
            
            // Update localStorage for consistency
            localStorage.setItem('adminUser', JSON.stringify(sessionData.user));
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminLoginTime', Date.now().toString());
            
            setIsLoading(false);
            return;
          }
        }
        
        // If server session failed, check if we have valid localStorage as fallback
        const adminUser = localStorage.getItem('adminUser');
        const isAuth = localStorage.getItem('adminAuthenticated');
        const loginTime = localStorage.getItem('adminLoginTime');
        
        if (adminUser && isAuth === 'true' && loginTime) {
          const loginTimestamp = parseInt(loginTime);
          const currentTime = Date.now();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          if (currentTime - loginTimestamp < sessionDuration) {
            try {
              const userData = JSON.parse(adminUser);
              setIsAuthenticated(true);
              setUserEmail(userData.email);
              setIsLoading(false);
              return;
            } catch (e) {
              console.error('Failed to parse user data:', e);
            }
          }
        }
        
        // Server validation failed and no valid localStorage, clear and redirect
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        router.replace('/admin/login');
        
      } catch (error) {
        console.error('Authentication check failed:', error);
        
        // On error, check localStorage as fallback
        const adminUser = localStorage.getItem('adminUser');
        const isAuth = localStorage.getItem('adminAuthenticated');
        const loginTime = localStorage.getItem('adminLoginTime');
        
        if (adminUser && isAuth === 'true' && loginTime) {
          const loginTimestamp = parseInt(loginTime);
          const currentTime = Date.now();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          if (currentTime - loginTimestamp < sessionDuration) {
            try {
              const userData = JSON.parse(adminUser);
              setIsAuthenticated(true);
              setUserEmail(userData.email);
              setIsLoading(false);
              return;
            } catch (e) {
              console.error('Failed to parse user data:', e);
            }
          }
        }
        
        // Clear invalid data and redirect
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminLoginTime');
        router.replace('/admin/login');
      }
    };

    checkAuthentication();
  }, [router]);

  // If still loading, show minimal loading or nothing
  if (isLoading) {
    return null; // Don't render anything while checking auth
  }

  // If not authenticated, redirect is already handled in useEffect
  if (!isAuthenticated) {
    return null; // Don't render anything for unauthorized users
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default AdminGuard;