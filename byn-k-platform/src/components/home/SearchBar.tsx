'use client'

import React, { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterClick?: () => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterClick }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
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
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-white border border-[#E2E8F0] rounded-lg text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2D8FDD]/20 focus:border-[#2D8FDD]"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="h-12 w-12 flex items-center justify-center bg-white border border-[#E2E8F0] rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        aria-label="Open filters"
      >
        <SlidersHorizontal size={20} />
      </button>
    </form>
  )
}
