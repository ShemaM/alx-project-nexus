'use client'

import { Search, CheckCircle2, SlidersHorizontal } from 'lucide-react'
import { useOpportunityFilters } from '@/hooks/useOpportunityFilters'
import FilterPills from './FilterPills'

interface AdvancedOpportunitiesFilterProps {
  resultsCount?: number
  className?: string
}

const categoryOptions = [
  { id: 'job', label: 'Jobs' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'internship', label: 'Internships' },
  { id: 'fellowship', label: 'Fellowships' },
  { id: 'training', label: 'Training' },
]

const workTypeOptions = [
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'onsite', label: 'On-site' },
]

const commitmentOptions = [
  { id: 'full_time', label: 'Full-time' },
  { id: 'part_time', label: 'Part-time' },
  { id: 'short_term', label: 'Short-term' },
  { id: 'long_term', label: 'Long-term' },
]

const fundingOptions = [
  { id: 'fully', label: 'Fully Funded' },
  { id: 'partially', label: 'Partially Funded' },
  { id: 'none', label: 'Not Funded' },
]

const documentOptions = [
  { id: 'refugee_id', label: 'Refugee ID' },
  { id: 'ctd', label: 'CTD' },
  { id: 'proof_of_registration', label: 'Proof of Registration' },
  { id: 'mandate', label: 'Mandate Letter' },
  { id: 'alien_card', label: 'Alien Card' },
  { id: 'waiting_slip', label: 'Waiting Slip' },
  { id: 'any_id', label: 'Any ID' },
]

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
    {children}
  </p>
)

const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15'

export const AdvancedOpportunitiesFilter: React.FC<AdvancedOpportunitiesFilterProps> = ({
  resultsCount,
  className = '',
}) => {
  const {
    filters,
    setSearchQuery,
    toggleCategory,
    toggleWorkType,
    toggleVerified,
    setFilter,
    removeFilter,
    clearFilters,
    getActiveFilters,
    activeFilterCount,
  } = useOpportunityFilters()

  const activeFilters = getActiveFilters()

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h3 className="text-sm font-black text-slate-900">Filters</h3>
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-primary transition hover:text-primary-dark hover:underline"
            >
              Clear all
            </button>
          )}
          {resultsCount !== undefined && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-black text-primary">
              {resultsCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="border-b border-slate-100 px-5 py-3">
          <FilterPills
            filters={activeFilters}
            onRemove={removeFilter}
            onClearAll={clearFilters}
          />
        </div>
      )}

      {/* Search */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      {/* Document fit */}
      <div className="border-b border-slate-100 px-5 py-4">
        <SectionLabel>Accepted documents</SectionLabel>
        <p className="mb-3 text-xs leading-5 text-slate-500">
          Prioritize roles that accept documents commonly held by refugees in Kenya.
        </p>
        <select
          value={filters.docs}
          onChange={(e) => setFilter('docs', e.target.value)}
          className={selectClass}
        >
          <option value="">Any document</option>
          {documentOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="border-b border-slate-100 px-5 py-4">
        <SectionLabel>Category</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filters.categories.includes(cat.id)
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work type */}
      <div className="border-b border-slate-100 px-5 py-4">
        <SectionLabel>Work type</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {workTypeOptions.map((wt) => (
            <button
              key={wt.id}
              type="button"
              onClick={() => toggleWorkType(wt.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                filters.workType.includes(wt.id)
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {wt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified toggle */}
      <div className="border-b border-slate-100 px-5 py-4">
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.isVerified}
              onChange={toggleVerified}
              className="sr-only"
            />
            <div className={`h-5 w-9 rounded-full transition-colors ${filters.isVerified ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${filters.isVerified ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">Verified only</span>
          </div>
        </label>
      </div>

      {/* Commitment */}
      <div className="border-b border-slate-100 px-5 py-4">
        <SectionLabel>Commitment</SectionLabel>
        <select
          value={filters.commitment}
          onChange={(e) => setFilter('commitment', e.target.value)}
          className={selectClass}
        >
          <option value="">All commitments</option>
          {commitmentOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Funding */}
      <div className="px-5 py-4">
        <SectionLabel>Funding</SectionLabel>
        <select
          value={filters.fundingType}
          onChange={(e) => setFilter('fundingType', e.target.value)}
          className={selectClass}
        >
          <option value="">All funding types</option>
          {fundingOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AdvancedOpportunitiesFilter
