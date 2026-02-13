import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BYN-K Brand Colors (from logo)
        primary: '#2D8FDD', // Logo Blue
        'primary-dark': '#1E6BB8', // Darker blue for hover states
        'primary-light': '#5BA8E6', // Lighter blue
        secondary: '#F5D300', // Logo Yellow/Gold
        'secondary-dark': '#D4B500', // Darker gold for hover states
        'secondary-light': '#FFE033', // Lighter gold
        accent: '#D52B2B', // Logo Red
        'accent-dark': '#B82424', // Darker red for hover states
        'accent-light': '#E05555', // Lighter red
        // Legacy colors (for gradual migration)
        'legacy-navy': '#0F4C81',
        'legacy-gold': '#F5A623',
      },
      backgroundImage: {
        // Advanced gradient backgrounds
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #2D8FDD 0%, #F5D300 50%, #D52B2B 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(45,143,221,0.1) 0%, rgba(245,211,0,0.1) 50%, rgba(213,43,43,0.1) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1E3A5F 0%, #2D8FDD 50%, #5BA8E6 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        // Enhanced shadows for depth
        'brand': '0 4px 20px -5px rgba(45, 143, 221, 0.3)',
        'brand-lg': '0 10px 40px -10px rgba(45, 143, 221, 0.4)',
        'glow': '0 0 20px rgba(45, 143, 221, 0.3)',
        'glow-accent': '0 0 20px rgba(213, 43, 43, 0.3)',
        'glow-secondary': '0 0 20px rgba(245, 211, 0, 0.3)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'inner-brand': 'inset 0 2px 10px rgba(45, 143, 221, 0.1)',
      },
      animation: {
        // Enhanced animations
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45, 143, 221, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(45, 143, 221, 0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config