'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Filter state interface for opportunity filtering.
 * Supports multiple selections for categories and work types.
 */
export interface OpportunityFilterState {
  categories: string[]
  workType: string[]
  isVerified: boolean
  searchQuery: string
  location: string
  commitment: string
  fundingType: string
  targetGroup: string
  educationLevel: string
}

const defaultFilters: OpportunityFilterState = {
  categories: [],
  workType: [],
  isVerified: false,
  searchQuery: '',
  location: '',
  commitment: '',
  fundingType: '',
  targetGroup: '',
  educationLevel: '',
}

/**
 * Custom hook for managing opportunity filters with debounced search and URL sync.
 * 
 * Features:
 * - Debounced search query updates
 * - URL parameter synchronization
 * - Multi-select support for categories and work types
 * - Modular filter state management
 */
export function useOpportunityFilters(debounceMs: number = 300) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<OpportunityFilterState>(defaultFilters)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Initialize filters from URL on mount
  useEffect(() => {
    if (isInitializedRef.current) return
    
    const categoriesParam = searchParams.get('categories')
    // Support both 'work_modes' (new) and 'work_type' (legacy) parameter names
    const workModesParam = searchParams.get('work_modes') || searchParams.get('work_type')
    const isVerifiedParam = searchParams.get('is_verified')
    const searchParam = searchParams.get('search')
    const locationParam = searchParams.get('location')
    const commitmentParam = searchParams.get('commitment')
    const fundingTypeParam = searchParams.get('funding_type')
    const targetGroupParam = searchParams.get('target_group')
    const educationLevelParam = searchParams.get('education_level')
    
    // Also support legacy single category param
    const categoryParam = searchParams.get('category')

    const initialFilters: OpportunityFilterState = {
      categories: categoriesParam 
        ? categoriesParam.split(',').filter(Boolean) 
        : categoryParam ? [categoryParam] : [],
      workType: workModesParam ? workModesParam.split(',').filter(Boolean) : [],
      isVerified: isVerifiedParam === 'true',
      searchQuery: searchParam || '',
      location: locationParam || '',
      commitment: commitmentParam || '',
      fundingType: fundingTypeParam || '',
      targetGroup: targetGroupParam || '',
      educationLevel: educationLevelParam || '',
    }

    setFilters(initialFilters)
    setDebouncedSearchQuery(initialFilters.searchQuery)
    isInitializedRef.current = true
  }, [searchParams])

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery)
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [filters.searchQuery, debounceMs])

  // Sync filters to URL when debounced search query or other filters change
  useEffect(() => {
    if (!isInitializedRef.current) return

    const newParams = new URLSearchParams()

    // Add categories as comma-separated
    if (filters.categories.length > 0) {
      newParams.set('categories', filters.categories.join(','))
    }

    // Add work types as comma-separated (use 'work_modes' for backend consistency)
    if (filters.workType.length > 0) {
      newParams.set('work_modes', filters.workType.join(','))
    }

    // Add boolean filters
    if (filters.isVerified) {
      newParams.set('is_verified', 'true')
    }

    // Add debounced search query
    if (debouncedSearchQuery) {
      newParams.set('search', debouncedSearchQuery)
    }

    // Add other filters
    if (filters.location) newParams.set('location', filters.location)
    if (filters.commitment) newParams.set('commitment', filters.commitment)
    if (filters.fundingType) newParams.set('funding_type', filters.fundingType)
    if (filters.targetGroup) newParams.set('target_group', filters.targetGroup)
    if (filters.educationLevel) newParams.set('education_level', filters.educationLevel)

    const queryString = newParams.toString()
    const newUrl = queryString ? `?${queryString}` : window.location.pathname

    // Use shallow navigation to avoid full page reload
    router.push(newUrl, { scroll: false })
  }, [
    filters.categories,
    filters.workType,
    filters.isVerified,
    filters.location,
    filters.commitment,
    filters.fundingType,
    filters.targetGroup,
    filters.educationLevel,
    debouncedSearchQuery,
    router,
  ])

  // Handler to update search query
  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }, [])

  // Handler to toggle category in array
  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }))
  }, [])

  // Handler to set categories (replace all)
  const setCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({ ...prev, categories }))
  }, [])

  // Handler to toggle work type in array
  const toggleWorkType = useCallback((workType: string) => {
    setFilters(prev => ({
      ...prev,
      workType: prev.workType.includes(workType)
        ? prev.workType.filter(w => w !== workType)
        : [...prev.workType, workType],
    }))
  }, [])

  // Handler to set work types (replace all)
  const setWorkTypes = useCallback((workType: string[]) => {
    setFilters(prev => ({ ...prev, workType }))
  }, [])

  // Handler to toggle verified filter
  const toggleVerified = useCallback(() => {
    setFilters(prev => ({ ...prev, isVerified: !prev.isVerified }))
  }, [])

  // Handler to set verified filter
  const setVerified = useCallback((isVerified: boolean) => {
    setFilters(prev => ({ ...prev, isVerified }))
  }, [])

  // Handler to set a single filter value
  const setFilter = useCallback(<K extends keyof OpportunityFilterState>(
    key: K,
    value: OpportunityFilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Handler to remove a specific filter
  const removeFilter = useCallback((filterKey: string, value?: string) => {
    setFilters(prev => {
      const updated = { ...prev }
      
      if (filterKey === 'categories' && value) {
        updated.categories = prev.categories.filter(c => c !== value)
      } else if (filterKey === 'workType' && value) {
        updated.workType = prev.workType.filter(w => w !== value)
      } else if (filterKey === 'isVerified') {
        updated.isVerified = false
      } else if (filterKey === 'searchQuery') {
        updated.searchQuery = ''
      } else if (filterKey === 'location') {
        updated.location = ''
      } else if (filterKey === 'commitment') {
        updated.commitment = ''
      } else if (filterKey === 'fundingType') {
        updated.fundingType = ''
      } else if (filterKey === 'targetGroup') {
        updated.targetGroup = ''
      } else if (filterKey === 'educationLevel') {
        updated.educationLevel = ''
      }
      
      return updated
    })
  }, [])

  // Handler to clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  // Get active filter count
  const activeFilterCount = 
    filters.categories.length +
    filters.workType.length +
    (filters.isVerified ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.commitment ? 1 : 0) +
    (filters.fundingType ? 1 : 0) +
    (filters.targetGroup ? 1 : 0) +
    (filters.educationLevel ? 1 : 0)

  // Get all active filters for pill display
  const getActiveFilters = useCallback(() => {
    const activeFilters: Array<{ key: string; value: string; label: string }> = []

    // Category filters
    filters.categories.forEach(cat => {
      activeFilters.push({
        key: 'categories',
        value: cat,
        label: getCategoryLabel(cat),
      })
    })

    // Work type filters
    filters.workType.forEach(wt => {
      activeFilters.push({
        key: 'workType',
        value: wt,
        label: getWorkTypeLabel(wt),
      })
    })

    // Boolean filters
    if (filters.isVerified) {
      activeFilters.push({
        key: 'isVerified',
        value: 'true',
        label: 'Verified Only',
      })
    }

    // Search query
    if (filters.searchQuery) {
      activeFilters.push({
        key: 'searchQuery',
        value: filters.searchQuery,
        label: `Search: "${filters.searchQuery}"`,
      })
    }

    // Other filters
    if (filters.location) {
      activeFilters.push({
        key: 'location',
        value: filters.location,
        label: getLocationLabel(filters.location),
      })
    }

    if (filters.commitment) {
      activeFilters.push({
        key: 'commitment',
        value: filters.commitment,
        label: getCommitmentLabel(filters.commitment),
      })
    }

    if (filters.fundingType) {
      activeFilters.push({
        key: 'fundingType',
        value: filters.fundingType,
        label: getFundingTypeLabel(filters.fundingType),
      })
    }

    if (filters.targetGroup) {
      activeFilters.push({
        key: 'targetGroup',
        value: filters.targetGroup,
        label: getTargetGroupLabel(filters.targetGroup),
      })
    }

    if (filters.educationLevel) {
      activeFilters.push({
        key: 'educationLevel',
        value: filters.educationLevel,
        label: getEducationLevelLabel(filters.educationLevel),
      })
    }

    return activeFilters
  }, [filters])

  return {
    filters,
    debouncedSearchQuery,
    activeFilterCount,
    setSearchQuery,
    toggleCategory,
    setCategories,
    toggleWorkType,
    setWorkTypes,
    toggleVerified,
    setVerified,
    setFilter,
    removeFilter,
    clearFilters,
    getActiveFilters,
  }
}

// Label helpers
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    job: 'Jobs',
    scholarship: 'Scholarships',
    internship: 'Internships',
    fellowship: 'Fellowships',
    training: 'Training',
  }
  return labels[category] || category
}

function getWorkTypeLabel(workType: string): string {
  const labels: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  }
  return labels[workType] || workType
}

function getLocationLabel(location: string): string {
  const labels: Record<string, string> = {
    kenya: 'Kenya',
    uganda: 'Uganda',
    tanzania: 'Tanzania',
    rwanda: 'Rwanda',
    remote: 'Remote',
    multiple: 'Multiple Locations',
  }
  return labels[location] || location
}

function getCommitmentLabel(commitment: string): string {
  const labels: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    short_term: 'Short-term',
    long_term: 'Long-term',
  }
  return labels[commitment] || commitment
}

function getFundingTypeLabel(fundingType: string): string {
  const labels: Record<string, string> = {
    fully: 'Fully Funded',
    partially: 'Partially Funded',
    none: 'Not Funded',
  }
  return labels[fundingType] || fundingType
}

function getTargetGroupLabel(targetGroup: string): string {
  const labels: Record<string, string> = {
    refugees: 'Refugees',
    youth: 'Youth',
    women: 'Women',
    all: 'All',
  }
  return labels[targetGroup] || targetGroup
}

function getEducationLevelLabel(educationLevel: string): string {
  const labels: Record<string, string> = {
    high_school: 'High School',
    undergraduate: 'Undergraduate',
    graduate: 'Graduate',
    any: 'Any Level',
  }
  return labels[educationLevel] || educationLevel
}
