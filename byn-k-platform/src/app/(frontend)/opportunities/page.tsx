'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AdvancedOpportunitiesFilter } from '@/components/filters/AdvancedOpportunitiesFilter'
import OpportunityCard from '@/components/ui/OpportunityCard'
import { Opportunity, OpportunityFilterParams } from '@/types'
import { getOpportunities } from '@/lib/api'

/**
 * OpportunitiesPageContent - Client Component
 * 
 * Main opportunities listing page with advanced filtering.
 * Features:
 * - Complex filter state (categories array, workType array, isVerified boolean, searchQuery string)
 * - Debounced search with URL sync
 * - Dynamic filter pills
 * - Real-time results count
 * - Mobile-responsive filter sidebar
 */
function OpportunitiesPageContent() {
  const searchParams = useSearchParams()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [resultsCount, setResultsCount] = useState(0)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Build filter params from URL
  const buildFilterParams = useCallback((): OpportunityFilterParams => {
    const params: OpportunityFilterParams = {}
    
    // Handle multi-select categories - send as comma-separated for backend
    const categoriesParam = searchParams.get('categories')
    const categoryParam = searchParams.get('category')
    if (categoriesParam) {
      // Backend expects individual category param, so we'll use the first for now
      // or enhance backend to support multiple
      const categories = categoriesParam.split(',').filter(Boolean)
      if (categories.length > 0) {
        params.category = categories[0] as OpportunityFilterParams['category']
      }
    } else if (categoryParam) {
      params.category = categoryParam as OpportunityFilterParams['category']
    }

    // Handle multi-select work types
    const workTypeParam = searchParams.get('work_type')
    if (workTypeParam) {
      const workTypes = workTypeParam.split(',').filter(Boolean)
      if (workTypes.length > 0) {
        params.work_mode = workTypes[0] as OpportunityFilterParams['work_mode']
      }
    }

    // Handle verified filter
    const isVerifiedParam = searchParams.get('is_verified')
    if (isVerifiedParam === 'true') {
      params.is_verified = true
    }

    // Handle search query
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      params.search = searchQuery
    }

    // Other filters
    const location = searchParams.get('location')
    if (location) params.location = location

    const commitment = searchParams.get('commitment')
    if (commitment) params.commitment = commitment as OpportunityFilterParams['commitment']

    const fundingType = searchParams.get('funding_type')
    if (fundingType) params.funding_type = fundingType as OpportunityFilterParams['funding_type']

    const targetGroup = searchParams.get('target_group')
    if (targetGroup) params.target_group = targetGroup as OpportunityFilterParams['target_group']

    const educationLevel = searchParams.get('education_level')
    if (educationLevel) params.education_level = educationLevel as OpportunityFilterParams['education_level']

    return params
  }, [searchParams])

  // Fetch opportunities whenever URL params change
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true)
      try {
        const filterParams = buildFilterParams()
        const response = await getOpportunities(filterParams)
        setOpportunities(response.data || [])
        setResultsCount(response.count || response.data?.length || 0)
      } catch (error) {
        console.error('Error fetching opportunities:', error)
        setOpportunities([])
        setResultsCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [buildFilterParams])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-linear-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            All Opportunities
          </h1>
          <p className="text-blue-100 text-lg">
            Discover opportunities that match your goals
          </p>
          {/* Results Count */}
          <div className="mt-4">
            <span className="text-[#F5D300] font-bold text-lg">
              {resultsCount} {resultsCount === 1 ? 'opportunity' : 'opportunities'} found
            </span>
          </div>
        </div>
      </section>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 p-4">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2D8FDD] text-white rounded-lg font-medium"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <AdvancedOpportunitiesFilter resultsCount={resultsCount} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4">
              <AdvancedOpportunitiesFilter resultsCount={resultsCount} />
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i}
                    className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-20 mb-2" />
                        <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : opportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal size={32} className="text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-700">No opportunities found</p>
                <p className="text-sm text-slate-500 mt-2">
                  Try adjusting your filters or check back later for new listings.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/**
 * OpportunitiesPage - Main Export with Suspense
 * 
 * Wraps the page content in Suspense for useSearchParams compatibility.
 */
export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D8FDD]" />
      </div>
    }>
      <OpportunitiesPageContent />
    </Suspense>
  )
}
