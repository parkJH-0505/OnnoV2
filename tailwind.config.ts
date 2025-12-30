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
        // Background
        bg: {
          primary: 'rgb(255, 255, 255)',
          secondary: 'rgb(249, 250, 251)',
          tertiary: 'rgb(243, 244, 246)',
        },
        // Primary - Neon Blue
        primary: {
          main: 'rgb(59, 130, 246)',
          bright: 'rgb(94, 162, 255)',
          dim: 'rgb(37, 99, 235)',
        },
        // Accent colors
        accent: {
          purple: 'rgb(139, 92, 246)',
          pink: 'rgb(236, 72, 153)',
          blue: 'rgb(14, 165, 233)',
        },
        // Text colors
        text: {
          primary: 'rgb(17, 24, 39)',
          secondary: 'rgb(55, 65, 81)',
          tertiary: 'rgb(107, 114, 128)',
          muted: 'rgb(156, 163, 175)',
        },
        // Semantic colors
        semantic: {
          success: 'rgb(76, 206, 148)',
          warning: 'rgb(251, 191, 36)',
          error: 'rgb(239, 68, 68)',
          info: 'rgb(59, 130, 246)',
        },
        // Card Type Colors (Onno Intervention Cards)
        card: {
          forward: '#10b981',
          'forward-light': 'rgba(16, 185, 129, 0.1)',
          safety: '#f59e0b',
          'safety-light': 'rgba(245, 158, 11, 0.1)',
          relation: '#3b82f6',
          'relation-light': 'rgba(59, 130, 246, 0.1)',
          bypass: '#8b5cf6',
          'bypass-light': 'rgba(139, 92, 246, 0.1)',
          summary: '#6b7280',
          'summary-light': 'rgba(107, 114, 128, 0.1)',
          constraint: '#ef4444',
          'constraint-light': 'rgba(239, 68, 68, 0.1)',
        },
        // Glass morphism
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          medium: 'rgba(255, 255, 255, 0.8)',
          heavy: 'rgba(255, 255, 255, 0.9)',
          border: 'rgba(0, 0, 0, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'glow-purple': '0 0 35px rgba(147, 97, 253, 0.5)',
        'glow-blue': '0 0 35px rgba(94, 162, 255, 0.5)',
        'glow-pink': '0 0 35px rgba(236, 72, 153, 0.5)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        'btn-primary': '0 10px 40px rgba(94, 162, 255, 0.3)',
        'btn-primary-hover': '0 15px 50px rgba(94, 162, 255, 0.5)',
        'btn-gradient': '0 15px 50px rgba(147, 97, 253, 0.5)',
        'glass': '0 0 30px rgba(94, 162, 255, 0.3)',
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '40px',
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'float': 'float 20s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
export default config
