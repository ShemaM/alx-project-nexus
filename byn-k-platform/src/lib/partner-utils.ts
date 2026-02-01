/**
 * Partner Utilities
 * 
 * Shared helper functions for partner-related operations
 */
import type { Media, Partner } from '@/payload-types'

/**
 * Get logo URL from partner's logo field
 * Handles both direct Media objects and relationship IDs
 */
export const getLogoUrl = (logo: number | Media | null | undefined): string | null => {
  if (!logo) return null
  if (typeof logo === 'number') return null
  return (logo as Media).url || null
}

/**
 * Map partner type to human-readable display label
 */
export const getPartnerTypeLabel = (type: Partner['type']): string => {
  const typeLabels: Record<string, string> = {
    company: 'Company',
    ngo: 'NGO',
    education: 'Educational Institution',
    government: 'Government',
    other: 'Organization',
  }
  return typeLabels[type] || 'Organization'
}
