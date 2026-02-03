import React from 'react'

import Spinner from './Spinner'

interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({ message = 'Loading...', className = '' }: PageLoaderProps) {
  return (
    <div
      className={`w-full min-h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-600 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default PageLoader
