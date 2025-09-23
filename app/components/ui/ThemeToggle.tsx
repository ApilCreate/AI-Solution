"use client";

import { Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, isLoading } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    console.log('🎨 Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  if (isLoading) {
    return (
      <div className={`p-2 rounded-lg ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        relative p-2 rounded-lg transition-all duration-300 
        hover:bg-gray-100 dark:hover:bg-gray-700
        active:scale-95 group
        ${isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800'}
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative">
        {isDark ? (
          <Sun className="w-5 h-5 transform transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transform transition-transform duration-300 group-hover:-rotate-12" />
        )}
        
        {/* Subtle glow effect for dark mode */}
        {isDark && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-sm animate-pulse" />
        )}
      </div>
      
      {/* Visual indicator */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
        <div className={`w-1 h-1 rounded-full transition-all duration-300 ${
          isDark ? 'bg-yellow-400' : 'bg-gray-400'
        }`} />
      </div>
    </button>
  );
}
