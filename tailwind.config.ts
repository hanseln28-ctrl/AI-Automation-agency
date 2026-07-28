import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0F',
          surface: '#12121A',
          card: '#1A1A24',
          elevated: '#242436',
        },
        accent: {
          DEFAULT: '#6C5CE7',
          hover: '#5A4BD6',
          subtle: 'rgba(108, 92, 231, 0.12)',
          muted: 'rgba(108, 92, 231, 0.24)',
          foreground: '#FFFFFF',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
          tertiary: '#6B7280',
          disabled: '#4A4A55',
        },
        border: {
          DEFAULT: '#2A2A3A',
          subtle: '#1E1E2E',
        },
        success: {
          DEFAULT: '#10B981',
          subtle: 'rgba(16, 185, 129, 0.12)',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.12)',
          foreground: '#000000',
        },
        danger: {
          DEFAULT: '#EF4444',
          subtle: 'rgba(239, 68, 68, 0.12)',
          foreground: '#FFFFFF',
        },
        info: {
          DEFAULT: '#6C5CE7',
          subtle: 'rgba(108, 92, 231, 0.12)',
          foreground: '#FFFFFF',
        },
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        glass:
          '0 4px 24px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(108, 92, 231, 0.08)',
        'glass-lg':
          '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(108, 92, 231, 0.12)',
        elevated:
          '0 8px 24px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(42, 42, 58, 0.6)',
        card: '0 2px 8px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(42, 42, 58, 0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'fade-out': 'fade-out 150ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'slide-down': 'slide-down 250ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
        'slide-in-left': 'slide-in-left 200ms ease-out',
        'scale-in': 'scale-in 150ms ease-out',
        'scale-out': 'scale-out 150ms ease-out',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-accent':
          'linear-gradient(135deg, #6C5CE7 0%, #8B7CF7 50%, #6C5CE7 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
