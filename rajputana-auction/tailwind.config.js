/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#05060A', // Deepest black
          900: '#0B0D17', // Main background
          800: '#151932', // Secondary background
          700: '#1E2342', // Borders/Cards
          400: '#D0D6F9', // Body text
          100: '#FFFFFF', // Headings
        },
        cosmos: {
          300: '#E0CCF7',
          500: '#8B5CF6',
          700: '#6D28D9',
          900: '#4C1D95',
        },
        priority: {
          low: '#9CA3AF',    // Gray
          medium: '#FCD34D', // Amber
          high: '#60A5FA',   // Blue
          critical: '#EF4444', // Red
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%)',
      }
    },
  },
  plugins: [],
}
