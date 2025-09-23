"use client";

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeDebugger() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <div className="text-sm">
        <div className="font-bold text-gray-900 dark:text-white">Theme Debug</div>
        <div className="text-gray-600 dark:text-gray-400">
          Current: <span className="font-mono">{theme}</span>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          HTML Class: <span className="font-mono">{document.documentElement.className}</span>
        </div>
        <button 
          onClick={toggleTheme}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
}