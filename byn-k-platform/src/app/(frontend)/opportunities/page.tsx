'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, SlidersHorizontal, X, Briefcase } from 'lucide-react'
import { AdvancedOpportunitiesFilter } from '@/components/filters/AdvancedOpportunitiesFilter'
import OpportunityCard from '@/components/ui/OpportunityCard'
import { Opportunity, OpportunityFilterParams } from '@/types'
import { getOpportunities } from '@/lib/api'

function OpportunitiesPageContent() {
  const searchParams = useSearchParams()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [resultsCount, setResultsCount] = useState(0)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const buildFilterParams = useCallback((): OpportunityFilterParams => {
    const params: OpportunityFilterParams = {}

    const categoriesParam = searchParams.get('categories')
    const categoryParam = searchParams.get('category')
    if (categoriesParam) {
      const categories = categoriesParam.split(',').filter(Boolean) as OpportunityFilterParams['categories']
      if (categories && categories.length > 0) params.categories = categories
    } else if (categoryParam) {
      params.category = categoryParam as OpportunityFilterParams['category']
    }

    const workModesParam = searchParams.get('work_modes') || searchParams.get('work_type')
    if (workModesParam) {
      const workModes = workModesParam.split(',').filter(Boolean) as OpportunityFilterParams['work_modes']
      if (workModes && workModes.length > 0) params.work_modes = workModes
    }

    if (searchParams.get('is_verified') === 'true') params.is_verified = true

    const searchQuery = searchParams.get('search')
    if (searchQuery) params.search = searchQuery

    const location = searchParams.get('location')
    if (location) params.location = location

    const commitment = searchParams.get('commitment')
    if (commitment) params.commitment = commitment as OpportunityFilterParams['commitment']

    const fundingType = searchParams.get('funding_type')
    if (fundingType) params.funding_type = fundingType as OpportunityFilterParams['funding_type']

    const isPaidParam = searchParams.get('is_paid')
    if (isPaidParam === 'true') params.is_paid = true
    if (isPaidParam === 'false') params.is_paid = false

    if (searchParams.get('closing_soon') === 'true') params.closing_soon = true
    if (searchParams.get('is_rolling') === 'true') params.is_rolling = true

    const deadlineBefore = searchParams.get('deadline_before')
    if (deadlineBefore) params.deadline_before = deadlineBefore

    const deadlineAfter = searchParams.get('deadline_after')
    if (deadlineAfter) params.deadline_after = deadlineAfter

    const targetGroup = searchParams.get('target_group')
    if (targetGroup) params.target_group = targetGroup as OpportunityFilterParams['target_group']

    const educationLevel = searchParams.get('education_level')
    if (educationLevel) params.education_level = educationLevel as OpportunityFilterParams['education_level']

    const docs = searchParams.get('docs')
    if (docs) params.docs = docs as OpportunityFilterParams['docs']

    const ordering = searchParams.get('ordering')
    if (ordering) params.ordering = ordering as OpportunityFilterParams['ordering']

    return params
  }, [searchParams])

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

      {/* ── Page header ── */}
      <section className="relative overflow-hidden bg-hero-dark">
        <div className="byn-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-on-dark transition hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="byn-kicker mb-2">Opportunity listings</p>
              <h1 className="text-3xl font-black tracking-tight text-on-dark md:text-4xl">
                All Opportunities
              </h1>
              <p className="mt-2 text-muted-on-dark">
                Discover opportunities that match your goals
              </p>
            </div>

            {!isLoading && (
              <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-5 py-2.5">
                <span className="text-lg font-black text-secondary">
                  {resultsCount.toLocaleString()}
                </span>
                <span className="ml-1.5 text-sm font-semibold text-on-dark">
                  {resultsCount === 1 ? 'opportunity' : 'opportunities'} found
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Mobile filter toggle bar ── */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
          {!isLoading && (
            <span className="text-sm font-semibold text-slate-500">
              {resultsCount.toLocaleString()} results
            </span>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute bottom-0 right-0 top-0 w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="text-lg font-black text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <AdvancedOpportunitiesFilter resultsCount={resultsCount} />
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6">
              <AdvancedOpportunitiesFilter resultsCount={resultsCount} />
            </div>
          </div>

          {/* Opportunities grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-start gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : opportunities.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Briefcase size={28} className="text-slate-400" />
                </div>
                <p className="text-lg font-bold text-slate-800">No opportunities found</p>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Try adjusting your filters or check back later for new listings.
                </p>
                <Link
                  href="/opportunities"
                  className="mt-5 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    }>
      <OpportunitiesPageContent />
    </Suspense>
  )
}
