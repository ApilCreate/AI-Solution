"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const savedTheme = localStorage.getItem('admin-theme') as Theme;
        
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemTheme: Theme = systemPrefersDark ? 'dark' : 'light';
        
        // Use saved theme or fall back to system preference
        const initialTheme = savedTheme || systemTheme;
        
        console.log('🎨 Theme initialization:', { 
          savedTheme, 
          systemPrefersDark, 
          systemTheme, 
          initialTheme 
        });
        
        setTheme(initialTheme);
        applyThemeToDocument(initialTheme);
        
      } catch (error) {
        console.error('Theme initialization error:', error);
        setTheme('light');
        applyThemeToDocument('light');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!isLoading) {
      console.log('🎨 Theme change detected:', theme);
      applyThemeToDocument(theme);
      
      try {
        localStorage.setItem('admin-theme', theme);
      } catch (error) {
        console.error('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme, isLoading]);

  const applyThemeToDocument = (newTheme: Theme) => {
    try {
      const root = document.documentElement;
      const body = document.body;
      
      console.log('🎨 Applying theme to document:', newTheme);
      
      // Remove existing theme classes
      root.classList.remove('light', 'dark');
      body.classList.remove('light', 'dark');
      
      // Add new theme class
      root.classList.add(newTheme);
      body.classList.add(newTheme);
      
      // Set data attribute for additional CSS targeting
      root.setAttribute('data-theme', newTheme);
      body.setAttribute('data-theme', newTheme);
      
      // Force style recalculation
      if (newTheme === 'dark') {
        root.style.colorScheme = 'dark';
        body.style.backgroundColor = '#0f172a';
        body.style.color = '#f8fafc';
      } else {
        root.style.colorScheme = 'light';
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#1a202c';
      }
      
      console.log('🎨 Document classes after theme application:', {
        rootClasses: root.className,
        bodyClasses: body.className,
        dataTheme: root.getAttribute('data-theme'),
        colorScheme: root.style.colorScheme
      });
      
    } catch (error) {
      console.error('Failed to apply theme to document:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('🎨 Theme toggle:', theme, '→', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
