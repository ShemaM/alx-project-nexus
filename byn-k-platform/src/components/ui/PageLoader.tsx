import React from 'react'

interface PageLoaderProps {
  message?: string
  className?: string
  fullScreen?: boolean
}

export function PageLoader({ message = 'Loading...', className = '', fullScreen = false }: PageLoaderProps) {
  const baseClasses = fullScreen 
    ? 'fixed inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-50'
    : 'w-full min-h-[40vh] flex flex-col items-center justify-center gap-6'
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Stylish branded spinner */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] rounded-full opacity-20 blur-lg animate-pulse"></div>
        
        {/* Main spinner */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 animate-spin" style={{ animationDuration: '1.5s' }}>
            <defs>
              <linearGradient id="page-loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2D8FDD" />
                <stop offset="50%" stopColor="#F5D300" />
                <stop offset="100%" stopColor="#D52B2B" />
              </linearGradient>
            </defs>
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              fill="none" 
              stroke="url(#page-loader-gradient)" 
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="120 60"
            />
          </svg>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-[#2D8FDD] to-[#1E6BB8] rounded-lg shadow-md"></div>
          </div>
        </div>
      </div>
      
      <p className="text-sm font-semibold bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] bg-clip-text text-transparent animate-pulse">
        {message}
      </p>
    </div>
  )
}

export default PageLoader
