import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import Footer from '@/components/layout/Footer'
import { getOpportunities, getFeaturedOpportunities } from '@/lib/api'

export default async function HomePage() {
  // 1. Fetch data from your Django API
  const [opportunitiesResponse, featuredOpportunitiesResponse] = await Promise.all([
    getOpportunities(),
    getFeaturedOpportunities(),
  ])

  // 2. Extract the actual data arrays from the response objects
  const allOpportunities = opportunitiesResponse?.data || []
  const featuredData = featuredOpportunitiesResponse?.data || []

  const allowedCategories = new Set(['job', 'scholarship', 'internship', 'fellowship'] as const)
  type AllowedCategory = (typeof allowedCategories extends Set<infer T> ? T : never)
  const toAllowedCategory = (category: unknown): AllowedCategory =>
    allowedCategories.has(category as AllowedCategory) ? (category as AllowedCategory) : 'job'

  const isOpportunityWithCategory = (value: unknown): value is { category: AllowedCategory } =>
    typeof value === 'object' && value !== null && 'category' in value

  // 3. Map Django fields to your Frontend Component props
  const featuredOpportunities = featuredData.map(opp => ({
    id: String(opp.id),
    title: opp.title,
    organization: opp.organization, // Matches our Django 'organization' field
    category: toAllowedCategory(opp.category),
    deadline: opp.deadline || '',
    isHot: true, // Since these are from the featured endpoint
  }))

  // 4. Calculate counts using the 'allOpportunities' variable
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
      <Hero featuredOpportunities={featuredOpportunities} />
      <CategoriesSection counts={counts} /> 
      <PartnersSection partners={partners} />
      <Footer />
    </div>
  )
}