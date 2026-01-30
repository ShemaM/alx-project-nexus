'use client'

import React, { useState } from 'react'

const filterOptions = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'job', label: 'Jobs' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'internship', label: 'Internships' },
  { id: 'fellowship', label: 'Fellowships' },
  { id: 'expiring_soon', label: 'Expiring Soon' },
]

interface FilterChipsProps {
  onFilterChange?: (filterId: string) => void
  defaultSelected?: string
}

export const FilterChips: React.FC<FilterChipsProps> = ({ 
  onFilterChange,
  defaultSelected = 'all'
}) => {
  const [selected, setSelected] = useState(defaultSelected)

  const handleSelect = (id: string) => {
    setSelected(id)
    onFilterChange?.(id)
  }

  return (
    <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleSelect(filter.id)}
            className={`
              whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selected === filter.id 
                ? 'bg-[#2D8FDD] text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
