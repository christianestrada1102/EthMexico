/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E6E8ED',
          100: '#CDD1DB',
          200: '#9BA3B7',
          300: '#697593',
          400: '#37476F',
          500: '#071027', // Principal
          600: '#050C1F',
          700: '#040917',
          800: '#02050F',
          900: '#010207',
        },
        arbitrum: {
          blue: '#28A0F0',
          cyan: '#00E0FF',
          purple: '#9C4CFF',
          darkBlue: '#0E163B',
          navy: '#0A0E17',
          dark: '#0F172A',
          light: '#1E293B',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#28A0F0',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          400: '#00E0FF',
          500: '#00E0FF',
          600: '#00B8CC',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: ['4.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['3rem', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      backdropBlur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(40, 160, 240, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 224, 255, 0.3)',
        'glow-lg-blue': '0 0 40px rgba(40, 160, 240, 0.4)',
        'glow-lg-cyan': '0 0 40px rgba(0, 224, 255, 0.4)',
      },
    },
  },
  plugins: [],
}

