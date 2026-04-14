/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        crisis: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        ink: {
          950: '#070b14',
        },
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(15,23,42,0.06), 0 10px 40px -20px rgba(15,23,42,0.35)',
      },
    },
  },
  plugins: [],
};
