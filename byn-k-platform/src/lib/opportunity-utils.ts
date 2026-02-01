/**
 * Opportunity Utilities
 * 
 * Shared helper functions for opportunity-related operations
 */
import type { Opportunity, Media } from '@/payload-types'
import type { TransformedOpportunity } from '@/components/home/HomeContent'
import { getOrganizationName, mapCategoryForDisplay } from '@/lib/payload'
import { generateSlug } from '@/types'

/**
 * Get document URL from opportunity's document field
 * Handles both direct Media objects and relationship IDs
 */
export const getDocumentUrl = (doc: Opportunity['opportunityDocument']): string | null => {
  if (!doc) return null
  if (typeof doc === 'number') return null
  return (doc as Media).url || null
}

/**
 * Transform Payload CMS opportunity to client-safe format
 * Used across multiple pages for consistent data transformation
 */
export const transformOpportunity = (opp: Opportunity): TransformedOpportunity => ({
  id: String(opp.id),
  slug: generateSlug(opp.title),
  title: opp.title,
  organizationName: getOrganizationName(opp),
  category: mapCategoryForDisplay(opp.category) as TransformedOpportunity['category'],
  documentation: opp.documentation || [],
  deadline: opp.deadline,
  isVerified: opp.isVerified ?? false,
  location: opp.location || null,
  // Application method fields
  applicationType: opp.applicationType || 'link',
  applyLink: opp.applyLink,
  applicationEmail: opp.applicationEmail,
  emailSubjectLine: opp.emailSubjectLine,
  requiredDocuments: opp.requiredDocuments,
  // Description type
  descriptionType: opp.descriptionType || 'text',
  opportunityDocumentUrl: getDocumentUrl(opp.opportunityDocument),
  createdAt: opp.createdAt,
})
