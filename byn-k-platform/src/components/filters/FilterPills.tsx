'use client'

import React from 'react'
import { X } from 'lucide-react'

interface FilterPill {
  key: string
  value: string
  label: string
}

interface FilterPillsProps {
  filters: FilterPill[]
  onRemove: (filterKey: string, value?: string) => void
  onClearAll?: () => void
  className?: string
}

/**
 * FilterPills Component
 * 
 * Displays active filters as removable pills.
 * When clicked, removes the specific filter from the state.
 */
export const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  onRemove,
  onClearAll,
  className = '',
}) => {
  if (filters.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filters.map((filter, index) => (
        <button
          key={`${filter.key}-${filter.value}-${index}`}
          type="button"
          onClick={() => onRemove(filter.key, filter.value)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors group"
          aria-label={`Remove ${filter.label} filter`}
        >
          <span>{filter.label}</span>
          <X 
            size={14} 
            className="text-primary/70 group-hover:text-primary" 
            aria-hidden="true"
          />
        </button>
      ))}
      
      {onClearAll && filters.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center px-3 py-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export default FilterPills
