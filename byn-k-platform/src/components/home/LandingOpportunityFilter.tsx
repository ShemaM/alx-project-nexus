'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'

type DeadlineFilter = '' | 'closing_soon' | 'rolling' | 'latest'
type CompensationFilter = '' | 'paid' | 'free'

export const LandingOpportunityFilter = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [category, setCategory] = useState('')
  const [deadline, setDeadline] = useState<DeadlineFilter>('')
  const [workMode, setWorkMode] = useState('')
  const [compensation, setCompensation] = useState<CompensationFilter>('')

  const categorySearchRoutes: Record<string, string> = {
    job: 'jobs',
    jobs: 'jobs',
    scholarship: 'scholarships',
    scholarships: 'scholarships',
    internship: 'internships',
    internships: 'internships',
    fellowship: 'fellowships',
    fellowships: 'fellowships',
    training: 'training',
    trainings: 'training',
  }

  const categoryValueToRoute: Record<string, string> = {
    job: 'jobs',
    scholarship: 'scholarships',
    internship: 'internships',
    fellowship: 'fellowships',
    training: 'training',
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    const normalizedQuery = query.trim().toLowerCase()
    const queryCategoryRoute = normalizedQuery ? categorySearchRoutes[normalizedQuery] : undefined
    const selectedCategoryRoute = category ? categoryValueToRoute[category] : undefined
    const destinationCategory = selectedCategoryRoute || queryCategoryRoute

    if (!destinationCategory && query.trim()) params.set('search', query.trim())
    if (workMode) params.set('work_modes', workMode)

    if (deadline === 'closing_soon') params.set('closing_soon', 'true')
    if (deadline === 'rolling') params.set('is_rolling', 'true')
    if (deadline === 'latest') params.set('ordering', 'deadline')

    if (compensation === 'paid') params.set('is_paid', 'true')
    if (compensation === 'free') params.set('is_paid', 'false')

    const queryString = params.toString()
    if (destinationCategory) {
      router.push(
        queryString ? `/categories/${destinationCategory}?${queryString}` : `/categories/${destinationCategory}`
      )
      return
    }

    router.push(queryString ? `/opportunities?${queryString}` : '/opportunities')
  }

  const clearFilters = () => {
    setCategory('')
    setDeadline('')
    setWorkMode('')
    setCompensation('')
  }

  return (
    <section className="bg-[#F8FAFC] py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#E2E8F0] rounded-2xl p-5 md:p-7 border border-[#CBD5E1]">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Find Your Perfect Opportunity</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs, scholarships, internships..."
                  className="w-full h-12 rounded-xl border border-[#CBD5E1] bg-white pl-11 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/25 focus:border-[#2D8FDD]"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="h-12 px-5 rounded-xl bg-[#2D8FDD] text-white font-semibold hover:bg-[#1E6BB8] transition-colors inline-flex items-center justify-center gap-2"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-[#1E6BB8] text-white font-semibold hover:bg-[#185A9B] transition-colors"
              >
                Search
              </button>
            </div>

            {showFilters && (
              <div className="bg-white border border-[#CBD5E1] rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 rounded-lg border border-[#CBD5E1] px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/25"
                  >
                    <option value="">All Categories</option>
                    <option value="job">Jobs</option>
                    <option value="scholarship">Scholarships</option>
                    <option value="internship">Internships</option>
                    <option value="fellowship">Fellowships</option>
                    <option value="training">Training</option>
                  </select>

                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value as DeadlineFilter)}
                    className="h-11 rounded-lg border border-[#CBD5E1] px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/25"
                  >
                    <option value="">All Deadlines</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="rolling">Rolling Applications</option>
                    <option value="latest">Nearest Deadline First</option>
                  </select>

                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="h-11 rounded-lg border border-[#CBD5E1] px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/25"
                  >
                    <option value="">All Work Modes</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>

                  <select
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value as CompensationFilter)}
                    className="h-11 rounded-lg border border-[#CBD5E1] px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/25"
                  >
                    <option value="">Paid + Free</option>
                    <option value="paid">Paid</option>
                    <option value="free">Free / Unpaid</option>
                  </select>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[#2D8FDD] hover:text-[#1E6BB8]"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default LandingOpportunityFilter

