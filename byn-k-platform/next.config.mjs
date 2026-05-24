const isDev = process.env.NODE_ENV === 'development'

// Content Security Policy — tightened for production
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for inline styles; unsafe-eval is needed in dev only
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https://alx-project-nexus-53hq.onrender.com",
  "connect-src 'self' https://alx-project-nexus-53hq.onrender.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspDirectives.join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

// Image patterns allowed for Next.js <Image /> optimization.
// HTTP localhost patterns are dev-only to avoid exposing them in production.
const imageRemotePatterns = [
  {
    protocol: 'https',
    hostname: 'alx-project-nexus-53hq.onrender.com',
    pathname: '/media/**',
  },
  ...(isDev
    ? [
        { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/media/**' },
        { protocol: 'http', hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      ]
    : []),
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors must fail the build — never silently ignore them
  typescript: {
    ignoreBuildErrors: false,
  },

  trailingSlash: false,

  images: {
    remotePatterns: imageRemotePatterns,
  },

  // Turbopack config (Next.js 16 default bundler). Empty object silences the
  // "webpack config but no turbopack config" error while keeping the webpack
  // fallback available via --webpack flag.
  turbopack: {},

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
