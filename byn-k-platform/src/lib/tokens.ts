/** Centralized design tokens for colors, typography, spacing, and animation easing. */
export const tokens = {
  colors: {
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    primary50: '#EFF6FF',
    gray900: '#111827',
    gray700: '#374151',
    gray500: '#6B7280',
    gray300: '#D1D5DB',
    gray100: '#F3F4F6',
    white: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    errorBg: '#FEF2F2',
  },
  typography: {
    headingXL: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1.2,
      letterSpacing: -0.02,
    },
    headingLG: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: 36,
      lineHeight: 1.3,
      letterSpacing: -0.01,
    },
    headingMD: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      fontSize: 24,
      lineHeight: 1.4,
    },
    bodyLG: {
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.6,
    },
    bodyMD: {
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.5,
    },
    bodySM: {
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.5,
      color: '#6B7280',
    },
  },
  spacing: {
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 24,
    space6: 32,
    space8: 48,
    space10: 64,
    space12: 80,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  animation: {
    fast: 150,
    base: 200,
    slow: 300,
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

export type Tokens = typeof tokens
