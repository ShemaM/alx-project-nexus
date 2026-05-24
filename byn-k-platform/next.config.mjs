const isDev = process.env.NODE_ENV === 'development'

// Derive the backend hostname from NEXT_PUBLIC_API_URL so we never
// hardcode a specific Render service URL in this config file.
// e.g. "https://bynk-backend.onrender.com/api" → "bynk-backend.onrender.com"
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
let backendHostname = ''
let backendProtocol = 'https'
try {
  const parsed = new URL(apiUrl)
  backendHostname = parsed.hostname
  backendProtocol = parsed.protocol.replace(':', '')
} catch {
  backendHostname = '127.0.0.1'
  backendProtocol = 'http'
}

// Content Security Policy — tightened for production
const cspDirectives = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for inline styles; unsafe-eval is needed in dev only
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  `img-src 'self' data: blob: ${backendProtocol}://${backendHostname}`,
  `connect-src 'self' ${backendProtocol}://${backendHostname}`,
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
// Derived from NEXT_PUBLIC_API_URL — no hardcoded hostnames.
const imageRemotePatterns = [
  ...(backendHostname && backendProtocol === 'https'
    ? [{ protocol: 'https', hostname: backendHostname, pathname: '/media/**' }]
    : []),
  ...(isDev || backendProtocol === 'http'
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
