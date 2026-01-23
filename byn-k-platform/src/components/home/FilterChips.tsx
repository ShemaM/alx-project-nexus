'use client'

import React, { useState } from 'react'

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'alien_card', label: 'Alien Card' },
  { id: 'ctd', label: 'CTD' },
  { id: 'passport', label: 'Passport' },
  { id: 'scholarship', label: 'Scholarship' },
]

interface FilterChipsProps {
  onFilterChange?: (filterId: string) => void
  defaultSelected?: string
}

export const FilterChips: React.FC<FilterChipsProps> = ({ 
  onFilterChange,
  defaultSelected = 'alien_card'
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
                ? 'bg-[#0F4C81] text-white' 
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
