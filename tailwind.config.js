/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        glassblue: '#e6f1ff',
        darkglass: '#10151f',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
      },
    },
  },
  plugins: [],
}
