'use client'

import React, { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterClick?: () => void
  filterCount?: number
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterClick, filterCount = 0 }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" 
          size={20} 
        />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={query}
          onChange={handleInputChange}
          className="w-full h-12 pl-12 pr-4 bg-white border border-[#E2E8F0] rounded-lg text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/20 focus:border-[#2D8FDD]"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="h-12 w-12 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors relative"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
        {filterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2D8FDD] text-white text-xs rounded-full flex items-center justify-center font-medium">
            {filterCount}
          </span>
        )}
      </button>
    </form>
  )
}
