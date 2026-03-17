/**
 * Opportunity Utilities
 * 
 * Shared helper functions for opportunity-related operations
 */

import { OpportunityCategory } from '@/types'

/** Build a detail URL given a category and slug, used across opportunity links. */
export function buildOpportunityPath(
  category?: OpportunityCategory | string | null,
  slug?: string | null,
): string {
  if (!slug) return '/opportunities'
  const safeCategory = (category || 'job').toString().toLowerCase()
  return `/opportunity/${encodeURIComponent(safeCategory)}/${encodeURIComponent(slug)}`
}
