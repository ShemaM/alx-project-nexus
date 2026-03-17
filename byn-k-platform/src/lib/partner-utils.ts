import { Partner } from '@/types'

/** Helper utilities for safely rendering partner logos fetched from the backend. */
export const PARTNER_LOGO_ALLOWLIST = new Set([
  'localhost',
  '127.0.0.1',
  'nexus-backend-lkps.onrender.com',
])

export function getSafePartnerLogoSrc(logo?: string | null): string | null {
  // Allow only trusted hosts or relative paths to keep Next.js Image safe.
  if (!logo) return null

  if (logo.startsWith('/')) {
    return logo
  }

  try {
    const parsed = new URL(logo)
    const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    if (!isHttp) return null

    if (parsed.hostname.includes('google.') && parsed.pathname.startsWith('/imgres')) {
      return null
    }

    if (!PARTNER_LOGO_ALLOWLIST.has(parsed.hostname)) {
      return null
    }

    if (parsed.pathname.startsWith('/media/')) {
      return logo
    }

    return null
  } catch {
    return null
  }
}

export function getPartnerLogoAlt(partner: Partner): string {
  // Provide descriptive alt text for logos across the site’s partner listings.
  return `${partner.name} logo`
}
