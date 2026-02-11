'use client'

import React from 'react'
import { Search, CheckCircle2 } from 'lucide-react'
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

/**
 * AdvancedOpportunitiesFilter Component
 * 
 * Provides comprehensive filtering with:
 * - Multi-select for categories and work types
 * - Debounced search query
 * - Verified toggle
 * - Filter pills for removing active filters
 * - Real-time results count
 */
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
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {/* Header with Results Count */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
          {resultsCount !== undefined && (
            <span className="text-sm font-medium text-[#2D8FDD]">
              {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
        
        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="mt-3">
            <FilterPills
              filters={activeFilters}
              onRemove={removeFilter}
              onClearAll={clearFilters}
            />
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories - Multi-select */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.categories.includes(cat.id)
                  ? 'bg-[#2D8FDD] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Work Type - Multi-select */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Work Type</h4>
        <div className="flex flex-wrap gap-2">
          {workTypeOptions.map((wt) => (
            <button
              key={wt.id}
              type="button"
              onClick={() => toggleWorkType(wt.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.workType.includes(wt.id)
                  ? 'bg-[#2D8FDD] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {wt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verified Toggle */}
      <div className="p-4 border-b border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isVerified}
            onChange={toggleVerified}
            className="w-5 h-5 rounded text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
          />
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Verified Only</span>
          </div>
        </label>
      </div>

      {/* Commitment */}
      <div className="p-4 border-b border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Commitment</h4>
        <select
          value={filters.commitment}
          onChange={(e) => setFilter('commitment', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:border-transparent"
        >
          <option value="">All Commitments</option>
          {commitmentOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Type */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Funding</h4>
        <select
          value={filters.fundingType}
          onChange={(e) => setFilter('fundingType', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:border-transparent"
        >
          <option value="">All Funding Types</option>
          {fundingOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default AdvancedOpportunitiesFilter
