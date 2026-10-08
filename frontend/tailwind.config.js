/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#b9d5ff',
          300: '#7cb2ff',
          400: '#3888ff',
          500: '#005ee6',
          600: '#0047b8',
          700: '#00368f',
          800: '#002e75',
          900: '#062961',
        },
        ai: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
