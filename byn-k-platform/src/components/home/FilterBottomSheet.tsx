'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply?: (filters: FilterState) => void
}

interface FilterState {
  category: string
  documentation: string[]
  location: string
}

const categories = [
  { id: 'job', label: 'Jobs' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'internship', label: 'Internships' },
  { id: 'training', label: 'Training' },
]

const documentationOptions = [
  { id: 'alien_card', label: 'Alien Card' },
  { id: 'ctd', label: 'CTD (Convention Travel Document)' },
  { id: 'passport', label: 'Passport' },
]

const locations = [
  { id: 'kenya', label: 'Kenya', flag: '🇰🇪' },
  { id: 'uganda', label: 'Uganda', flag: '🇺🇬' },
  { id: 'tanzania', label: 'Tanzania', flag: '🇹🇿' },
]

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  onApply 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    documentation: [],
    location: 'kenya'
  })

  // Reset scroll when sheet opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClearAll = () => {
    setFilters({
      category: '',
      documentation: [],
      location: 'kenya'
    })
  }

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }))
  }

  const handleDocumentationToggle = (docId: string) => {
    setFilters(prev => ({
      ...prev,
      documentation: prev.documentation.includes(docId)
        ? prev.documentation.filter(d => d !== docId)
        : [...prev.documentation, docId]
    }))
  }

  const handleLocationChange = (locationId: string) => {
    setFilters(prev => ({ ...prev, location: locationId }))
  }

  const handleApply = () => {
    onApply?.(filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden animate-slideUp">
        {/* Handle bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-slate-900">Filter Opportunities</h2>
          <button 
            onClick={handleClearAll}
            className="text-[#0F4C81] text-sm font-semibold hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] px-5 py-4">
          {/* Category Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label 
                  key={cat.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={filters.category === cat.id}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="w-5 h-5 text-[#0F4C81] border-slate-300 focus:ring-[#0F4C81]"
                  />
                  <span className="text-slate-700">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Documentation Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Documentation</h3>
            <div className="space-y-2">
              {documentationOptions.map((doc) => (
                <label 
                  key={doc.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    value={doc.id}
                    checked={filters.documentation.includes(doc.id)}
                    onChange={() => handleDocumentationToggle(doc.id)}
                    className="w-5 h-5 rounded text-[#0F4C81] border-slate-300 focus:ring-[#0F4C81]"
                  />
                  <span className="text-slate-700">{doc.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Location</h3>
            <div className="space-y-2">
              {locations.map((loc) => (
                <label 
                  key={loc.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="location"
                    value={loc.id}
                    checked={filters.location === loc.id}
                    onChange={() => handleLocationChange(loc.id)}
                    className="w-5 h-5 text-[#0F4C81] border-slate-300 focus:ring-[#0F4C81]"
                  />
                  <span className="text-xl mr-1">{loc.flag}</span>
                  <span className="text-slate-700">{loc.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-[#F5A623] hover:bg-[#d98c1d] text-white py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
