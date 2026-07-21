import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fin: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F1F5F9',
          primary: '#2563EB',
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          text: '#0F172A',
          mute: '#64748B',
        },
        brand: {
          dark: '#0F172A',
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          accent: '#2563EB',
          accentHover: '#1D4ED8',
          bg: '#F8FAFC',
          gray: '#64748B',
          text: '#0F172A',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563EB',
          600: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 4px 20px rgba(0,0,0,0.05)',
        glow: '0 4px 14px rgba(37,99,235,0.25)',
        'glow-success': '0 4px 14px rgba(22,163,74,0.2)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        'card-shine':
          'radial-gradient(120% 80% at 100% 0%, rgba(37,99,235,0.05) 0%, transparent 55%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
