/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        monoton: ['Monoton', 'cursive'],
      },
      colors: {
        // Theme-aware colors using CSS variables
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-color': 'var(--border-color)',
        'accent-color': 'var(--accent-color)',
        
        // Original colors
        glassblue: '#e6f1ff',
        darkglass: '#10151f',
        
        // Modern theme colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'theme': '0 4px 6px var(--shadow-color)',
        'theme-lg': '0 10px 15px var(--shadow-color)',
      },
      width: {
        '70': '17.5rem', // 280px for sidebar
      },
      spacing: {
        '70': '17.5rem', // 280px for sidebar
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
