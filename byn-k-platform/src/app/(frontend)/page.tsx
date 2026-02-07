import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getFeaturedOpportunities, getCategoryCounts, getPartners } from '@/lib/api'

// Force dynamic rendering to fetch data at runtime (not at build time)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Initialize default values
  let allOpportunities: Array<{ category?: string }> = []
  let featuredData: Array<{ id: number; title: string; slug?: string; organization?: string; organization_name?: string; category?: string; deadline?: string | null }> = []
  let categoryCounts = {
    jobs: 0,
    scholarships: 0,
    internships: 0,
    fellowships: 0,
    partners: 0,
  }
  let partnersData: Array<{ id: number; name: string; website?: string; logo?: string; is_featured?: boolean; opportunity_count?: number }> = []
  
  // Fetch data from Django API (with error handling for build time)
  try {
    const [opportunitiesResponse, featuredOpportunitiesResponse, countsResponse, partnersResponse] = await Promise.all([
      getOpportunities(),
      getFeaturedOpportunities(),
      getCategoryCounts(),
      getPartners(),
    ])
    
    allOpportunities = opportunitiesResponse?.data || []
    featuredData = featuredOpportunitiesResponse?.data || []
    categoryCounts = countsResponse || categoryCounts
    partnersData = partnersResponse?.data || []
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

  // Map Django fields to Frontend Component props - include slug for SEO-friendly URLs
  const featuredOpportunities = featuredData.map(opp => ({
    id: String(opp.id),
    title: opp.title,
    slug: opp.slug || String(opp.id), // Use slug for URL, fallback to ID
    organization: opp.organization_name || opp.organization || 'Unknown Organization',
    category: toAllowedCategory(opp.category),
    deadline: opp.deadline || '',
    isHot: true, // Since these are from the featured endpoint
  }))

  // Use category counts from API, with fallback to calculated counts
  const counts = {
    jobs: categoryCounts.jobs || allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'job').length,
    scholarships: categoryCounts.scholarships || allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'scholarship').length,
    internships: categoryCounts.internships || allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'internship').length,
    fellowships: categoryCounts.fellowships || allOpportunities.filter((o: unknown) => isOpportunityWithCategory(o) && o.category === 'fellowship').length,
    partners: categoryCounts.partners || partnersData.length, 
  }

  // Map partners data to expected format
  const partners = partnersData.map(p => ({
    id: p.id,
    name: p.name,
    website: p.website,
    logo: p.logo,
    is_featured: p.is_featured,
    opportunitiesCount: p.opportunity_count || 0,
  }))

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