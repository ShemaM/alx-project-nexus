'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply?: (filters: FilterState) => void
  currentFilters?: FilterState
}

export interface FilterState {
  category: string
  documentation: string[]
  location: string
  deadlineStatus: string
  // New filter parity fields
  workMode: string
  commitment: string
  targetGroup: string
  educationLevel: string
  fundingType: string
  isPaid: boolean | null
  closingSoon: boolean
  isRolling: boolean
}

const categories = [
  { id: 'job', label: 'Jobs' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'internship', label: 'Internships' },
  { id: 'fellowship', label: 'Fellowships' },
  { id: 'training', label: 'Training' },
]

const documentationOptions = [
  { id: 'alien_card', label: 'Alien Card' },
  { id: 'ctd', label: 'CTD (Convention Travel Document)' },
  { id: 'passport', label: 'Passport' },
  { id: 'waiting_slip', label: 'Waiting Slip' },
  { id: 'any_id', label: 'Any ID Accepted' },
]

const locations = [
  { id: 'kenya', label: 'Kenya', flag: '🇰🇪' },
  { id: 'uganda', label: 'Uganda', flag: '🇺🇬' },
  { id: 'tanzania', label: 'Tanzania', flag: '🇹🇿' },
  { id: 'rwanda', label: 'Rwanda', flag: '🇷🇼' },
  { id: 'remote', label: 'Remote', flag: '🌍' },
  { id: 'multiple', label: 'Multiple Locations', flag: '📍' },
]

const workModeOptions = [
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

const targetGroupOptions = [
  { id: 'refugees', label: 'Refugees' },
  { id: 'youth', label: 'Youth' },
  { id: 'women', label: 'Women' },
  { id: 'all', label: 'All' },
]

const educationLevelOptions = [
  { id: 'high_school', label: 'High School' },
  { id: 'undergraduate', label: 'Undergraduate' },
  { id: 'graduate', label: 'Graduate' },
  { id: 'any', label: 'Any Level' },
]

const fundingTypeOptions = [
  { id: 'fully', label: 'Fully Funded' },
  { id: 'partially', label: 'Partially Funded' },
  { id: 'none', label: 'Not Funded' },
]

const deadlineStatusOptions = [
  { id: 'all', label: 'All Deadlines' },
  { id: 'active', label: 'Active Only' },
  { id: 'expiring_soon', label: 'Expiring Soon (7 days)' },
  { id: 'expired', label: 'Expired' },
]

const defaultFilters: FilterState = {
  category: '',
  documentation: [],
  location: '',
  deadlineStatus: 'all',
  workMode: '',
  commitment: '',
  targetGroup: '',
  educationLevel: '',
  fundingType: '',
  isPaid: null,
  closingSoon: false,
  isRolling: false,
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  onApply,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters || defaultFilters)

  // Update filters when currentFilters prop changes
  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters)
    }
  }, [currentFilters])

  // Manage body scroll lock when sheet opens/closes
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const handleClearAll = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: prev.category === categoryId ? '' : categoryId 
    }))
  }, [])

  const handleDocumentationToggle = useCallback((docId: string) => {
    setFilters(prev => ({
      ...prev,
      documentation: prev.documentation.includes(docId)
        ? prev.documentation.filter(d => d !== docId)
        : [...prev.documentation, docId]
    }))
  }, [])

  const handleLocationChange = useCallback((locationId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      location: prev.location === locationId ? '' : locationId 
    }))
  }, [])

  const handleDeadlineStatusChange = useCallback((statusId: string) => {
    setFilters(prev => ({ ...prev, deadlineStatus: statusId }))
  }, [])

  const handleWorkModeChange = useCallback((modeId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      workMode: prev.workMode === modeId ? '' : modeId 
    }))
  }, [])

  const handleCommitmentChange = useCallback((commitmentId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      commitment: prev.commitment === commitmentId ? '' : commitmentId 
    }))
  }, [])

  const handleTargetGroupChange = useCallback((groupId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      targetGroup: prev.targetGroup === groupId ? '' : groupId 
    }))
  }, [])

  const handleEducationLevelChange = useCallback((levelId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      educationLevel: prev.educationLevel === levelId ? '' : levelId 
    }))
  }, [])

  const handleFundingTypeChange = useCallback((typeId: string) => {
    setFilters(prev => ({ 
      ...prev, 
      fundingType: prev.fundingType === typeId ? '' : typeId 
    }))
  }, [])

  const handleIsPaidChange = useCallback((value: boolean | null) => {
    setFilters(prev => ({ ...prev, isPaid: value }))
  }, [])

  const handleClosingSoonChange = useCallback((value: boolean) => {
    setFilters(prev => ({ ...prev, closingSoon: value }))
  }, [])

  const handleApply = useCallback(() => {
    onApply?.(filters)
    onClose()
  }, [filters, onApply, onClose])

  // Calculate active filter count
  const activeFilterCount = [
    filters.category ? 1 : 0,
    filters.documentation.length > 0 ? 1 : 0,
    filters.location ? 1 : 0,
    filters.deadlineStatus && filters.deadlineStatus !== 'all' ? 1 : 0,
    filters.workMode ? 1 : 0,
    filters.commitment ? 1 : 0,
    filters.targetGroup ? 1 : 0,
    filters.educationLevel ? 1 : 0,
    filters.fundingType ? 1 : 0,
    filters.isPaid !== null ? 1 : 0,
    filters.closingSoon ? 1 : 0,
    filters.isRolling ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        aria-label="Close filter sheet"
      />
      
      {/* Bottom Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden animate-slideUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        {/* Handle bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-[#E2E8F0]">
          <h2 id="filter-title" className="text-xl font-bold text-slate-900">Filter Opportunities</h2>
          <button 
            onClick={handleClearAll}
            className="text-[#2D8FDD] text-sm font-semibold hover:underline"
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
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Work Mode Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Work Mode</h3>
            <div className="space-y-2">
              {workModeOptions.map((mode) => (
                <label 
                  key={mode.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="workMode"
                    value={mode.id}
                    checked={filters.workMode === mode.id}
                    onChange={() => handleWorkModeChange(mode.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Commitment Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Commitment</h3>
            <div className="space-y-2">
              {commitmentOptions.map((commitment) => (
                <label 
                  key={commitment.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="commitment"
                    value={commitment.id}
                    checked={filters.commitment === commitment.id}
                    onChange={() => handleCommitmentChange(commitment.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{commitment.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Target Group Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Target Group</h3>
            <div className="space-y-2">
              {targetGroupOptions.map((group) => (
                <label 
                  key={group.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="targetGroup"
                    value={group.id}
                    checked={filters.targetGroup === group.id}
                    onChange={() => handleTargetGroupChange(group.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{group.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Education Level Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Education Level</h3>
            <div className="space-y-2">
              {educationLevelOptions.map((level) => (
                <label 
                  key={level.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="educationLevel"
                    value={level.id}
                    checked={filters.educationLevel === level.id}
                    onChange={() => handleEducationLevelChange(level.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Funding Type Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Funding Type</h3>
            <div className="space-y-2">
              {fundingTypeOptions.map((type) => (
                <label 
                  key={type.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="fundingType"
                    value={type.id}
                    checked={filters.fundingType === type.id}
                    onChange={() => handleFundingTypeChange(type.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Paid Opportunity Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Compensation</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <input
                  type="radio"
                  name="isPaid"
                  checked={filters.isPaid === null}
                  onChange={() => handleIsPaidChange(null)}
                  className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                />
                <span className="text-slate-700">All</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <input
                  type="radio"
                  name="isPaid"
                  checked={filters.isPaid === true}
                  onChange={() => handleIsPaidChange(true)}
                  className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                />
                <span className="text-slate-700">Paid Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <input
                  type="radio"
                  name="isPaid"
                  checked={filters.isPaid === false}
                  onChange={() => handleIsPaidChange(false)}
                  className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                />
                <span className="text-slate-700">Unpaid / Volunteer</span>
              </label>
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
                    className="w-5 h-5 rounded text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
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
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-xl mr-1">{loc.flag}</span>
                  <span className="text-slate-700">{loc.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Deadline</h3>
            <div className="space-y-2">
              {deadlineStatusOptions.map((status) => (
                <label 
                  key={status.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="deadlineStatus"
                    value={status.id}
                    checked={filters.deadlineStatus === status.id}
                    onChange={() => handleDeadlineStatusChange(status.id)}
                    className="w-5 h-5 text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                  />
                  <span className="text-slate-700">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Filters Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={filters.closingSoon}
                  onChange={() => handleClosingSoonChange(!filters.closingSoon)}
                  className="w-5 h-5 rounded text-[#2D8FDD] border-slate-300 focus:ring-[#2D8FDD]"
                />
                <span className="text-slate-700">🔥 Closing Soon (7 days)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-5 border-t border-[#E2E8F0] bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Show Results {activeFilterCount > 0 && `(${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''})`}
          </button>
        </div>
      </div>
    </>
  )
}
