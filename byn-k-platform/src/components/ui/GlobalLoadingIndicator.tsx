/**
 * Global Loading Indicator Component
 * 
 * Shows a loading overlay during page transitions.
 * Integrates with the LoadingStateContext for global state management.
 * 
 * @module components/ui/GlobalLoadingIndicator
 */
'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoadingState } from '@/contexts'

const LOADING_MESSAGES: Record<string, string> = {
  'search': 'Searching opportunities...',
  'explore-opportunities': 'Opening opportunities...',
  'view-details': 'Opening opportunity details...',
}

const PATIENT_MESSAGES = [
  'Loading your content...',
  'Almost ready...',
  'Just a moment...',
]

const MAX_LOADING_MS = 5_000

function LoadingIndicatorContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { loadingStates, clearAllLoading } = useLoadingState()
  const [isNavigationLoading, setIsNavigationLoading] = useState(false)
  const [navigationMessage, setNavigationMessage] = useState('Loading, please wait...')
  const [patientMessageIndex, setPatientMessageIndex] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [loadingStartedAt, setLoadingStartedAt] = useState<number | null>(null)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    // If path changed, stop loading
    if (prevPath !== pathname) {
      setIsNavigationLoading(false)
      setNavigationMessage('Loading, please wait...')
      setPatientMessageIndex(0)
      setElapsedMs(0)
      setLoadingStartedAt(null)
      clearAllLoading()
      setPrevPath(pathname)
    }
  }, [pathname, prevPath, searchParams, clearAllLoading])

  // Listen for navigation events via custom events
  useEffect(() => {
    const handleStart = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>
      setNavigationMessage(customEvent.detail?.message || 'Loading, please wait...')
      setIsNavigationLoading(true)
      setPatientMessageIndex(0)
      setElapsedMs(0)
      setLoadingStartedAt(Date.now())
    }
    const handleEnd = () => {
      setIsNavigationLoading(false)
      setNavigationMessage('Loading, please wait...')
      setPatientMessageIndex(0)
      setElapsedMs(0)
      setLoadingStartedAt(null)
    }

    window.addEventListener('navigation-start', handleStart)
    window.addEventListener('navigation-end', handleEnd)

    return () => {
      window.removeEventListener('navigation-start', handleStart)
      window.removeEventListener('navigation-end', handleEnd)
    }
  }, [])

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      // Support explicit button-triggered loading pages.
      const buttonWithMessage = target.closest('button[data-loading-message]') as HTMLButtonElement | null
      if (buttonWithMessage && !buttonWithMessage.disabled) {
        triggerNavigationLoading(buttonWithMessage.dataset.loadingMessage || 'Working on your request...')
        return
      }

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href') || ''
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

      const url = new URL(anchor.href, window.location.origin)
      if (url.origin !== window.location.origin) return

      const current = `${window.location.pathname}${window.location.search}`
      const next = `${url.pathname}${url.search}`
      if (current === next) return

      triggerNavigationLoading(`Opening ${url.pathname.replaceAll('/', ' ').trim() || 'page'}...`)
    }

    document.addEventListener('click', clickHandler, true)
    return () => {
      document.removeEventListener('click', clickHandler, true)
    }
  }, [])

  const activeLoadingKeys = Object.keys(loadingStates).filter((key) => loadingStates[key])
  const firstLoadingKey = activeLoadingKeys[0] || ''
  const contextMessage = activeLoadingKeys.length > 0
    ? (
      LOADING_MESSAGES[firstLoadingKey] ||
      (firstLoadingKey.startsWith('view-details-') ? 'Opening opportunity details...' : '') ||
      (firstLoadingKey.startsWith('explore-') ? 'Opening opportunities...' : '') ||
      'Working on your request...'
    )
    : ''

  const isLoading = isNavigationLoading || activeLoadingKeys.length > 0
  const message = contextMessage || navigationMessage
  // Note: remainingSeconds removed as it's no longer displayed in the new UI

  useEffect(() => {
    if (!isLoading) {
      setPatientMessageIndex(0)
      setElapsedMs(0)
      setLoadingStartedAt(null)
      return
    }

    if (!loadingStartedAt) {
      setLoadingStartedAt(Date.now())
    }

    const timer = window.setInterval(() => {
      const startedAt = loadingStartedAt ?? Date.now()
      const elapsed = Date.now() - startedAt
      setElapsedMs(elapsed)
      setPatientMessageIndex(Math.min(PATIENT_MESSAGES.length - 1, Math.floor(elapsed / 1500)))

      // Never keep loader visible for more than 5 seconds.
      if (elapsed >= MAX_LOADING_MS) {
        setIsNavigationLoading(false)
        clearAllLoading()
      }
    }, 500)

    return () => {
      window.clearInterval(timer)
    }
  }, [isLoading, loadingStartedAt, clearAllLoading])

  if (!isLoading) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-md flex items-center justify-center z-[9998] transition-all duration-300"
      role="progressbar"
      aria-label="Page loading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#2D8FDD]/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-[#F5D300]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-[#D52B2B]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col items-center gap-8 relative">
        {/* Stylish branded loader */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] rounded-full opacity-20 blur-xl animate-pulse"></div>
          
          {/* Main spinner container */}
          <div className="relative w-24 h-24">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200/50"></div>
            
            {/* Animated gradient ring */}
            <svg className="absolute inset-0 w-24 h-24 animate-spin" style={{ animationDuration: '1.5s' }}>
              <defs>
                <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D8FDD" />
                  <stop offset="50%" stopColor="#F5D300" />
                  <stop offset="100%" stopColor="#D52B2B" />
                </linearGradient>
              </defs>
              <circle 
                cx="48" 
                cy="48" 
                r="44" 
                fill="none" 
                stroke="url(#loader-gradient)" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="180 90"
              />
            </svg>
            
            {/* Inner logo element */}
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#2D8FDD] via-[#2D8FDD] to-[#1E6BB8] rounded-xl shadow-lg shadow-[#2D8FDD]/30 flex items-center justify-center transform hover:scale-105 transition-transform">
                <span className="text-white font-black text-lg tracking-tight">BYN</span>
              </div>
            </div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#F5D300] rounded-full shadow-sm shadow-[#F5D300]/50"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#D52B2B] rounded-full shadow-sm shadow-[#D52B2B]/50"></div>
          </div>
        </div>

        {/* Loading text with brand styling */}
        <div className="text-center space-y-2">
          <p className="text-xl font-bold bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] bg-clip-text text-transparent">
            {message}
          </p>
          <p className="text-sm text-slate-500 font-medium animate-pulse">
            {PATIENT_MESSAGES[patientMessageIndex]}
          </p>
        </div>

        {/* Modern progress bar */}
        <div className="w-56 h-1.5 bg-slate-200/70 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] rounded-full relative"
            style={{ 
              width: `${Math.min(100, (elapsedMs / MAX_LOADING_MS) * 100)}%`,
              transition: 'width 0.5s ease-out'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GlobalLoadingIndicator() {
  return (
    <Suspense fallback={null}>
      <LoadingIndicatorContent />
    </Suspense>
  )
}

// Helper function to trigger navigation loading
export function triggerNavigationLoading(message?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('navigation-start', { detail: { message } }))
  }
}

// Helper function to end navigation loading
export function endNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('navigation-end'))
  }
}

export default GlobalLoadingIndicator
