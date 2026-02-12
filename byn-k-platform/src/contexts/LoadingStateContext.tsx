/**
 * Loading State Context
 * 
 * Provides a global loading state management system for the application.
 * Allows components to track loading states for specific actions like
 * 'Explore Opportunities', 'View Details', 'Search', etc.
 * 
 * Usage:
 * ```tsx
 * const { isLoading, setLoading } = useLoadingState()
 * 
 * const handleClick = async () => {
 *   setLoading('search', true)
 *   await performSearch()
 *   setLoading('search', false)
 * }
 * 
 * // Check if a specific action is loading
 * if (isLoading('search')) { ... }
 * ```
 * 
 * @module contexts/LoadingStateContext
 */
'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ============================================
// Types
// ============================================

/** Loading state keys for different actions */
export type LoadingKey = 
  | 'search'
  | 'explore-opportunities'
  | 'view-details'
  | `view-details-${string}`
  | `explore-${string}`
  | string

/** Context value type */
interface LoadingStateContextValue {
  loadingStates: Record<string, boolean>
  isLoading: (key: LoadingKey) => boolean
  setLoading: (key: LoadingKey, loading: boolean) => void
  clearAllLoading: () => void
}

// ============================================
// Context
// ============================================

const LoadingStateContext = createContext<LoadingStateContextValue | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

interface LoadingStateProviderProps {
  children: ReactNode
}

export function LoadingStateProvider({ children }: LoadingStateProviderProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  /**
   * Check if a specific action is loading
   * @param key - The loading state key to check
   */
  const isLoading = useCallback((key: LoadingKey): boolean => {
    return loadingStates[key] ?? false
  }, [loadingStates])

  /**
   * Set loading state for a specific action
   * @param key - The loading state key
   * @param loading - Whether the action is loading
   */
  const setLoading = useCallback((key: LoadingKey, loading: boolean) => {
    setLoadingStates((prev) => {
      if (loading) {
        return { ...prev, [key]: true }
      } else {
        const newState = { ...prev }
        delete newState[key]
        return newState
      }
    })
  }, [])

  /**
   * Clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    setLoadingStates({})
  }, [])

  const value: LoadingStateContextValue = {
    loadingStates,
    isLoading,
    setLoading,
    clearAllLoading,
  }

  return (
    <LoadingStateContext.Provider value={value}>
      {children}
    </LoadingStateContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

/**
 * Hook to access the loading state system
 * @throws Error if used outside LoadingStateProvider
 */
export function useLoadingState(): LoadingStateContextValue {
  const context = useContext(LoadingStateContext)
  
  if (context === undefined) {
    throw new Error('useLoadingState must be used within a LoadingStateProvider')
  }
  
  return context
}

export default LoadingStateContext
