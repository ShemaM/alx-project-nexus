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
  'Please hold on while we prepare your page.',
  'Still working. This usually takes 2-6 seconds.',
  'Almost there. Thank you for your patience.',
  'Finalizing your request now.',
]

const MAX_LOADING_MS = 10_000

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
  const remainingSeconds = Math.max(0, Math.ceil((MAX_LOADING_MS - elapsedMs) / 1000))

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
      setPatientMessageIndex(Math.min(PATIENT_MESSAGES.length - 1, Math.floor(elapsed / 2500)))

      // Never keep loader visible for more than 10 seconds.
      if (elapsed >= MAX_LOADING_MS) {
        setIsNavigationLoading(false)
        clearAllLoading()
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [isLoading, loadingStartedAt, clearAllLoading])

  if (!isLoading) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[9998] transition-opacity duration-300"
      role="progressbar"
      aria-label="Page loading"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#2D8FDD]/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-transparent border-t-[#2D8FDD] border-r-[#2D8FDD]/50 rounded-full absolute top-0 left-0 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D8FDD] to-[#1E6BB8] rounded-lg shadow-lg"></div>
          </div>
        </div>
        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-700">Loading</p>
          <p className="text-sm text-slate-500 mt-1">{message}</p>
          <p className="text-xs text-slate-400 mt-2">{PATIENT_MESSAGES[patientMessageIndex]}</p>
          <p className="text-xs text-slate-400 mt-1">Approx. {remainingSeconds}s remaining</p>
        </div>
        {/* Progress bar */}
        <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] rounded-full animate-shimmer" 
               style={{ width: '100%', backgroundSize: '200% 100%' }}>
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
