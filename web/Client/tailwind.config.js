/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          50: '#fffbf0',
          100: '#fff7e6',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#f97316',
          'secondary': '#fbbf24',
          'accent': '#1f2937',
          'neutral': '#f3f4f6',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#f3f4f6',
          'info': '#3b82f6',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        }
      }
    ]
  }
}
