import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getFeaturedOpportunities } from '@/lib/api'

// Force dynamic rendering to fetch data at runtime (not at build time)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Initialize default values
  let allOpportunities: Array<{ category?: string }> = []
  let featuredData: Array<{ id: number; title: string; organization?: string; organization_name?: string; category?: string; deadline?: string | null }> = []
  
  // Fetch data from Django API (with error handling for build time)
  try {
    const [opportunitiesResponse, featuredOpportunitiesResponse] = await Promise.all([
      getOpportunities(),
      getFeaturedOpportunities(),
    ])
    
    allOpportunities = opportunitiesResponse?.data || []
    featuredData = featuredOpportunitiesResponse?.data || []
  } catch (error) {
    // API not available (likely during build or when Django server is down)
    console.error('Error fetching opportunities:', error)
  }

  const allowedCategories = new Set(['job', 'scholarship', 'internship', 'fellowship'] as const)
  type AllowedCategory = (typeof allowedCategories extends Set<infer T> ? T : never)
  const toAllowedCategory = (category: unknown): AllowedCategory =>
    allowedCategories.has(category as AllowedCategory) ? (category as AllowedCategory) : 'job'

  const isOpportunityWithCategory = (value: unknown): value is { category: AllowedCategory } =>
    typeof value === 'object' && value !== null && 'category' in value

  // Map Django fields to Frontend Component props
  const featuredOpportunities = featuredData.map(opp => ({
    id: String(opp.id),
    title: opp.title,
    organization: opp.organization_name || opp.organization || 'Unknown Organization',
    category: toAllowedCategory(opp.category),
    deadline: opp.deadline || '',
    isHot: true, // Since these are from the featured endpoint
  }))

  // Calculate counts from opportunities data
  const counts = {
    jobs: allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'job').length,
    scholarships: allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'scholarship')
      .length,
    internships: allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'internship')
      .length,
    fellowships: allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'fellowship')
      .length,
    partners: 0, 
  }

  const partners: React.ComponentProps<typeof PartnersSection>['partners'] = [] 

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Passing the mapped data and counts to your components */}
      <Hero featuredOpportunities={featuredOpportunities} counts={counts} />
      <CategoriesSection counts={counts} /> 
      <PartnersSection partners={partners} />
      <Footer />
    </div>
  )
}