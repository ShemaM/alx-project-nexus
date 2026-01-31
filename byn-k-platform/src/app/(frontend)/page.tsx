import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero, FeaturedOpportunity } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { HomeContent, TransformedOpportunity } from '@/components/home/HomeContent'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getLatestOpportunities, getOrganizationName, mapCategoryForDisplay, getOpportunityCounts, getFeaturedOpportunities } from '@/lib/payload'
import { generateSlug } from '@/types'
import type { Opportunity, Media } from '@/payload-types'

// Force dynamic rendering to fetch data at runtime (requires database connection)
export const dynamic = 'force-dynamic'

// Helper to get document URL
const getDocumentUrl = (doc: Opportunity['opportunityDocument']): string | null => {
  if (!doc) return null
  if (typeof doc === 'number') return null
  return (doc as Media).url || null
}

// Transform Payload opportunity to client-safe format
const transformOpportunity = (opp: Opportunity): TransformedOpportunity => ({
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

// Valid category values for FeaturedOpportunity
const validFeaturedCategories = ['job', 'scholarship', 'internship', 'fellowship'] as const
type ValidFeaturedCategory = typeof validFeaturedCategories[number]

// Transform opportunity to featured format for hero carousel
const transformToFeatured = (opp: Opportunity): FeaturedOpportunity => {
  const mappedCategory = mapCategoryForDisplay(opp.category)
  // Validate category is a valid featured category
  const category: ValidFeaturedCategory = validFeaturedCategories.includes(mappedCategory as ValidFeaturedCategory)
    ? (mappedCategory as ValidFeaturedCategory)
    : 'job' // Default to 'job' if invalid
  
  return {
    id: String(opp.id),
    title: opp.title,
    organization: getOrganizationName(opp),
    category,
    deadline: opp.deadline,
    isHot: opp.isFeatured ?? false,
  }
}

export default async function HomePage() {
  // Fetch real opportunities from Payload CMS
  const [opportunities, latestOpportunities, counts, featuredOpportunities] = await Promise.all([
    getOpportunities(),
    getLatestOpportunities(5),
    getOpportunityCounts(),
    getFeaturedOpportunities(5),
  ])

  // Transform to client-safe format
  const transformedOpportunities = opportunities.map(transformOpportunity)
  const transformedLatestOpportunities = latestOpportunities.map(transformOpportunity)
  const transformedFeatured = featuredOpportunities.length > 0 
    ? featuredOpportunities.map(transformToFeatured)
    : undefined // Use default featured if none found

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero counts={counts} featuredOpportunities={transformedFeatured} />
      <CategoriesSection counts={counts} />
      <HomeContent 
        opportunities={transformedOpportunities} 
        latestOpportunities={transformedLatestOpportunities}
      />
      <PartnersSection />
      <Footer />
    </div>
  )
}