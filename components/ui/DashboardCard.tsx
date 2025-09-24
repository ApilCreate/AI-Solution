import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  className?: string;
  children?: ReactNode;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  }
};

export default function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  className = "",
  children 
}: DashboardCardProps) {
  const colors = colorVariants[color];
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border ${colors.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 ${colors.bg} rounded-xl`}>
          <Icon className={`w-7 h-7 ${colors.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-sm font-medium ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <span className={trend.isPositive ? '↑' : '↓'}></span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{trend.label}</span>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {value}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {title}
        </p>
      </div>
      
      {children}
    </div>
  );
}
