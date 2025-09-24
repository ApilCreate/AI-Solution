"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const getToastIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <XCircle className="w-5 h-5" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5" />;
    case 'info':
      return <Info className="w-5 h-5" />;
  }
};

const getToastColors = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-900/90 border-green-700',
        icon: 'text-green-400',
        title: 'text-green-100',
        message: 'text-green-200'
      };
    case 'error':
      return {
        bg: 'bg-red-900/90 border-red-700',
        icon: 'text-red-400',
        title: 'text-red-100',
        message: 'text-red-200'
      };
    case 'warning':
      return {
        bg: 'bg-yellow-900/90 border-yellow-700',
        icon: 'text-yellow-400',
        title: 'text-yellow-100',
        message: 'text-yellow-200'
      };
    case 'info':
      return {
        bg: 'bg-blue-900/90 border-blue-700',
        icon: 'text-blue-400',
        title: 'text-blue-100',
        message: 'text-blue-200'
      };
  }
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const colors = getToastColors(toast.type);
  const icon = getToastIcon(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-xl max-w-md w-full ${colors.bg}`}
    >
      <div className={`flex-shrink-0 ${colors.icon}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-semibold text-sm ${colors.title}`}>
          {toast.title}
        </h4>
        {toast.message && (
          <p className={`text-sm mt-1 ${colors.message}`}>
            {toast.message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration (default 5 seconds)
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};