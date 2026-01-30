/**
 * Site Tour Context
 * 
 * Manages the onboarding tour for first-time visitors.
 * Tracks tour progress and completion state.
 * 
 * Uses localStorage to persist tour completion status.
 * 
 * @module contexts/SiteTourContext
 */
'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

// ============================================
// Types
// ============================================

/** Individual tour step */
export interface TourStep {
  id: string
  target: string // CSS selector for the target element
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

/** Context value type */
interface SiteTourContextValue {
  isOpen: boolean
  currentStep: number
  steps: TourStep[]
  hasCompletedTour: boolean
  startTour: () => void
  endTour: () => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  skipTour: () => void
}

// ============================================
// Default Tour Steps
// ============================================

const defaultSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="hero"]',
    title: 'Welcome to BYN-K Platform! 👋',
    content: 'Your one-stop destination for jobs, scholarships, internships, and fellowships for the Banyamulenge community in Kenya.',
    placement: 'bottom',
  },
  {
    id: 'categories',
    target: '[data-tour="categories"]',
    title: 'Browse by Category',
    content: 'Quickly filter opportunities by type - Jobs, Scholarships, Internships, or Fellowships.',
    placement: 'bottom',
  },
  {
    id: 'search',
    target: '[data-tour="search"]',
    title: 'Search & Filter',
    content: 'Use the search bar and filters to find opportunities that match your needs and documentation.',
    placement: 'bottom',
  },
  {
    id: 'opportunities',
    target: '[data-tour="opportunities"]',
    title: 'Explore Opportunities',
    content: 'Browse through verified opportunities. Click on any card to see full details and apply.',
    placement: 'top',
  },
  {
    id: 'bookmarks',
    target: '[data-tour="bookmarks"]',
    title: 'Save for Later',
    content: 'Bookmark opportunities you\'re interested in to easily find them later. Sign in to access your saved items.',
    placement: 'left',
  },
]

// ============================================
// Context
// ============================================

const SiteTourContext = createContext<SiteTourContextValue | undefined>(undefined)

// ============================================
// Provider Component
// ============================================

interface SiteTourProviderProps {
  children: ReactNode
}

export function SiteTourProvider({ children }: SiteTourProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasCompletedTour, setHasCompletedTour] = useState(false)
  const [steps] = useState<TourStep[]>(defaultSteps)

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem('bynk-tour-completed')
    if (completed === 'true') {
      setHasCompletedTour(true)
    } else {
      // Auto-start tour for first-time visitors after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  /**
   * Start the tour from the beginning
   */
  const startTour = useCallback(() => {
    setCurrentStep(0)
    setIsOpen(true)
  }, [])

  /**
   * End the tour and mark as completed
   */
  const endTour = useCallback(() => {
    setIsOpen(false)
    setHasCompletedTour(true)
    localStorage.setItem('bynk-tour-completed', 'true')
  }, [])

  /**
   * Move to the next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      endTour()
    }
  }, [currentStep, steps.length, endTour])

  /**
   * Move to the previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  /**
   * Go to a specific step
   */
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }, [steps.length])

  /**
   * Skip the tour without completing
   */
  const skipTour = useCallback(() => {
    setIsOpen(false)
    setHasCompletedTour(true)
    localStorage.setItem('bynk-tour-completed', 'true')
  }, [])

  const value: SiteTourContextValue = {
    isOpen,
    currentStep,
    steps,
    hasCompletedTour,
    startTour,
    endTour,
    nextStep,
    prevStep,
    goToStep,
    skipTour,
  }

  return (
    <SiteTourContext.Provider value={value}>
      {children}
    </SiteTourContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

/**
 * Hook to access the site tour system
 * @throws Error if used outside SiteTourProvider
 */
export function useSiteTour(): SiteTourContextValue {
  const context = useContext(SiteTourContext)
  
  if (context === undefined) {
    throw new Error('useSiteTour must be used within a SiteTourProvider')
  }
  
  return context
}

export default SiteTourContext
