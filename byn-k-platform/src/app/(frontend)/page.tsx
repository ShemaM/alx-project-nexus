import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero, FeaturedOpportunity } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { HomeContent } from '@/components/home/HomeContent'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getLatestOpportunities, getOrganizationName, mapCategoryForDisplay, getOpportunityCounts, getFeaturedOpportunities, getPartnersWithOpportunityCounts } from '@/lib/payload'
import { transformOpportunity } from '@/lib/opportunity-utils'
import type { Opportunity } from '@/payload-types'

// Force dynamic rendering to fetch data at runtime (requires database connection)
export const dynamic = 'force-dynamic'

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
  const [opportunities, latestOpportunities, counts, featuredOpportunities, partnersWithCounts] = await Promise.all([
    getOpportunities(),
    getLatestOpportunities(5),
    getOpportunityCounts(),
    getFeaturedOpportunities(5),
    getPartnersWithOpportunityCounts(),
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
      <PartnersSection partners={partnersWithCounts} />
      <Footer />
    </div>
  )
}