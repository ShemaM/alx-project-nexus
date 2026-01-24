import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { HomeContent, TransformedOpportunity } from '@/components/home/HomeContent'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getLatestOpportunities, getOrganizationName, mapCategoryForDisplay } from '@/lib/payload'
import { generateSlug } from '@/types'
import type { Opportunity } from '@/payload-types'

// Force dynamic rendering to fetch data at runtime (requires database connection)
export const dynamic = 'force-dynamic'

// Transform Payload opportunity to client-safe format
const transformOpportunity = (opp: Opportunity): TransformedOpportunity => ({
  id: String(opp.id),
  slug: generateSlug(opp.title),
  title: opp.title,
  organizationName: getOrganizationName(opp),
  category: mapCategoryForDisplay(opp.category) as TransformedOpportunity['category'],
  documentation: opp.documentation,
  deadline: opp.deadline,
  isVerified: opp.isVerified ?? false,
  applyLink: opp.applyLink,
  createdAt: opp.createdAt,
})

export default async function HomePage() {
  // Fetch real opportunities from Payload CMS
  const opportunities = await getOpportunities()
  const latestOpportunities = await getLatestOpportunities(5)

  // Transform to client-safe format
  const transformedOpportunities = opportunities.map(transformOpportunity)
  const transformedLatestOpportunities = latestOpportunities.map(transformOpportunity)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <CategoriesSection />
      <HomeContent 
        opportunities={transformedOpportunities} 
        latestOpportunities={transformedLatestOpportunities}
      />
      <PartnersSection />
      <Footer />
    </div>
  )
}