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
        secondary: '#F5D300', // Logo Yellow/Gold
        'secondary-dark': '#D4B500', // Darker gold for hover states
        accent: '#D52B2B', // Logo Red
        'accent-dark': '#B82424', // Darker red for hover states
        // Legacy colors (for gradual migration)
        'legacy-navy': '#0F4C81',
        'legacy-gold': '#F5A623',
      },
    },
  },
  plugins: [],
}
export default config