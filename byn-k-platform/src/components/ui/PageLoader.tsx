import React from 'react'

interface PageLoaderProps {
  message?: string
  className?: string
  fullScreen?: boolean
}

export function PageLoader({ message = 'Loading...', className = '', fullScreen = false }: PageLoaderProps) {
  const baseClasses = fullScreen 
    ? 'fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-slate-600 z-50'
    : 'w-full min-h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-600'
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#2D8FDD]/20 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-transparent border-t-[#2D8FDD] rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  )
}

export default PageLoader
