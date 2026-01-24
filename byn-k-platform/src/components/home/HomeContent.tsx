'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { SearchBar } from '@/components/home/SearchBar'
import { FilterChips } from '@/components/home/FilterChips'
import { FilterBottomSheet } from '@/components/home/FilterBottomSheet'
import { LatestOpportunitiesSidebar } from '@/components/home/LatestOpportunitiesSidebar'
import { ArrowRight } from 'lucide-react'

// Transformed opportunity interface for client-side use
export interface TransformedOpportunity {
  id: string
  slug: string
  title: string
  organizationName: string
  category: 'job' | 'scholarship' | 'internship' | 'training' | 'fellowship'
  documentation: string[]
  deadline: string
  isVerified: boolean
  // Application method fields
  applicationType: 'link' | 'email'
  applyLink?: string | null
  applicationEmail?: string | null
  emailSubjectLine?: string | null
  requiredDocuments?: string | null
  // Description type
  descriptionType?: 'text' | 'document'
  opportunityDocumentUrl?: string | null
  createdAt: string
}

interface HomeContentProps {
  opportunities: TransformedOpportunity[]
  latestOpportunities: TransformedOpportunity[]
}

export const HomeContent: React.FC<HomeContentProps> = ({ opportunities, latestOpportunities }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Filter opportunities based on search and filters
  const filteredOpportunities = opportunities.filter((opp) => {
    // Filter by search query
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Filter by documentation type (if not "all")
    if (selectedFilter !== 'all' && selectedFilter !== 'scholarship') {
      if (!opp.documentation.includes(selectedFilter)) {
        return false
      }
    }
    // Filter by scholarship category
    if (selectedFilter === 'scholarship' && opp.category !== 'scholarship') {
      return false
    }
    return true
  })

  return (
    <>
      {/* Section Header */}
      <section className="bg-white border-y border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-2">
                Latest Opportunities
              </h2>
              <p className="text-slate-600">
                Filter by your documentation type to find matching opportunities
              </p>
            </div>
            <Link 
              href="/categories/jobs"
              className="inline-flex items-center gap-2 text-[#2D8FDD] font-semibold hover:text-[#1E6BB8] transition-colors"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SearchBar 
          onSearch={setSearchQuery} 
          onFilterClick={() => setIsFilterOpen(true)} 
        />
        <FilterChips 
          onFilterChange={setSelectedFilter}
          defaultSelected={selectedFilter}
        />
      </section>
      
      {/* Main Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Opportunities Feed */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    id={opp.id}
                    slug={opp.slug}
                    title={opp.title}
                    organizationName={opp.organizationName}
                    category={opp.category}
                    documentation={opp.documentation}
                    deadline={opp.deadline}
                    isVerified={opp.isVerified}
                    applicationType={opp.applicationType}
                    applyLink={opp.applyLink}
                    applicationEmail={opp.applicationEmail}
                    emailSubjectLine={opp.emailSubjectLine}
                    requiredDocuments={opp.requiredDocuments}
                  />
                ))
              ) : (
                <div className="md:col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-[#E2E8F0]">
                  <p className="text-lg">No opportunities found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Opportunities Sidebar - Right Column */}
          <div className="lg:w-80 flex-shrink-0">
            <LatestOpportunitiesSidebar opportunities={latestOpportunities} />
          </div>
        </div>
      </section>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  )
}
