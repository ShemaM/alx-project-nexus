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

function LoadingIndicatorContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)

  useEffect(() => {
    // If path changed, stop loading
    if (prevPath !== pathname) {
      setIsLoading(false)
      setPrevPath(pathname)
    }
  }, [pathname, prevPath, searchParams])

  // Listen for navigation events via custom events
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleEnd = () => setIsLoading(false)

    window.addEventListener('navigation-start', handleStart)
    window.addEventListener('navigation-end', handleEnd)

    return () => {
      window.removeEventListener('navigation-start', handleStart)
      window.removeEventListener('navigation-end', handleEnd)
    }
  }, [])

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
          <p className="text-sm text-slate-500 mt-1">Please wait...</p>
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
export function triggerNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('navigation-start'))
  }
}

// Helper function to end navigation loading
export function endNavigationLoading() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('navigation-end'))
  }
}

export default GlobalLoadingIndicator
