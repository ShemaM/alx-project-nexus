/**
 * Navigation Loader Component
 * 
 * Shows a full-screen spinner overlay when navigating between pages.
 * Uses Next.js router events to detect navigation start/end.
 * 
 * @module components/ui/NavigationLoader
 */
'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  // Track route changes - reset navigation state when route changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  if (!isNavigating) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9998]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#2D8FDD]/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-[#2D8FDD] rounded-full absolute top-0 left-0 animate-spin"></div>
        </div>
        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1">
          <p className="text-lg font-medium text-slate-600">Loading</p>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default NavigationLoader
