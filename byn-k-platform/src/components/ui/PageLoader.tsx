'use client'

import React from 'react'

interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  return (
    <div 
      className={`${fullScreen ? 'min-h-screen' : 'min-h-[400px]'} bg-slate-50 flex items-center justify-center`}
    >
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E2E8F0]" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2D8FDD] animate-spin" />
          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-[#F5D300]/20 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-[#F5D300]/40 animate-pulse delay-75" />
          <div className="absolute inset-5 rounded-full bg-[#F5D300] animate-pulse delay-150" />
        </div>
        
        {/* Loading text with animated dots */}
        <p className="text-slate-600 font-medium text-lg">{message}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="w-2 h-2 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-[#2D8FDD] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for cards
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-20 h-20 bg-slate-200 rounded-xl" />
        <div className="w-16 h-6 bg-slate-200 rounded-full" />
      </div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-4 bg-slate-200 rounded w-4/6" />
      </div>
      <div className="pt-4 border-t border-[#E2E8F0] flex justify-between">
        <div className="h-5 bg-slate-200 rounded w-24" />
        <div className="h-5 bg-slate-200 rounded w-20" />
      </div>
    </div>
  )
}

// Skeleton loader for opportunity cards
export const OpportunityCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
          <div className="h-6 bg-slate-200 rounded w-48" />
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-6 bg-slate-200 rounded w-16" />
        <div className="h-6 bg-slate-200 rounded w-24" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 bg-slate-200 rounded w-20" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>
      <div className="flex gap-3">
        <div className="h-10 bg-slate-200 rounded flex-1" />
        <div className="h-10 bg-slate-200 rounded flex-1" />
      </div>
    </div>
  )
}

// Content loader with multiple skeletons
export const ContentLoader: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default PageLoader
