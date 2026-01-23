'use client'

import React, { useState } from 'react'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { SearchBar } from '@/components/home/SearchBar'
import { FilterChips } from '@/components/home/FilterChips'
import { FilterBottomSheet } from '@/components/home/FilterBottomSheet'

// Sample opportunities for demonstration
const sampleOpportunities = [
  {
    id: '1',
    title: 'Junior Software Developer',
    organizationName: 'Tech Solutions Kenya',
    category: 'job' as const,
    documentation: ['alien_card', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '#'
  },
  {
    id: '2',
    title: 'DAFI Scholarship 2025',
    organizationName: 'UNHCR',
    category: 'scholarship' as const,
    documentation: ['alien_card', 'ctd'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '#'
  },
  {
    id: '3',
    title: 'Digital Marketing Internship',
    organizationName: 'Growth Agency',
    category: 'internship' as const,
    documentation: ['passport', 'alien_card'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: false,
    applyLink: '#'
  },
  {
    id: '4',
    title: 'Coding Bootcamp Training',
    organizationName: 'ALX Africa',
    category: 'training' as const,
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '#'
  }
]

export const HomeContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('alien_card')

  // Filter opportunities based on search and filters
  const filteredOpportunities = sampleOpportunities.filter((opp) => {
    // Filter by search query
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Filter by documentation type (if not "all")
    if (selectedFilter !== 'all' && selectedFilter !== 'scholarship') {
      const docFilter = selectedFilter as 'alien_card' | 'ctd' | 'passport'
      if (!opp.documentation.includes(docFilter)) {
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
      
      {/* Opportunities Feed */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col gap-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                title={opp.title}
                organizationName={opp.organizationName}
                category={opp.category}
                documentation={opp.documentation}
                deadline={opp.deadline}
                isVerified={opp.isVerified}
                applyLink={opp.applyLink}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">No opportunities found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          )}
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
