'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { SearchBar } from '@/components/home/SearchBar'
import { FilterChips } from '@/components/home/FilterChips'
import { FilterBottomSheet } from '@/components/home/FilterBottomSheet'
import { ArrowRight } from 'lucide-react'

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
  },
  {
    id: '5',
    title: 'Customer Service Representative',
    organizationName: 'Safaricom',
    category: 'job' as const,
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '#'
  },
  {
    id: '6',
    title: 'Mastercard Foundation Scholars',
    organizationName: 'Mastercard Foundation',
    category: 'scholarship' as const,
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '#'
  }
]

export const HomeContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

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
      {/* Section Header */}
      <section className="bg-white border-y border-[#E2E8F0] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-2">
                Latest Opportunities
              </h2>
              <p className="text-slate-600">
                Filter by your documentation type to find matching opportunities
              </p>
            </div>
            <Link 
              href="/categories/jobs"
              className="inline-flex items-center gap-2 text-[#0F4C81] font-semibold hover:text-[#0d3f6b] transition-colors"
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
      
      {/* Opportunities Feed */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                id={opp.id}
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
            <div className="md:col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-[#E2E8F0]">
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
