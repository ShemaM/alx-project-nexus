/**
 * OrganizationLogo Component
 * 
 * Displays an organization logo with Next.js Image optimization
 * and a stylized fallback placeholder when no logo is available.
 * 
 * Features:
 * - Lazy loading with Next.js Image component
 * - Graceful fallback on image load errors
 * - Consistent color generation for placeholders based on org name
 * - Multiple size options
 * 
 * @module components/ui/OrganizationLogo
 */
'use client'

import React, { useState } from 'react'

interface OrganizationLogoProps {
  logoUrl?: string | null
  organizationName?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Size configuration
const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl',
}

// Generate a consistent color for the placeholder based on organization name
const getPlaceholderColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-orange-500',
  ]
  
  // Simple hash based on the first few characters
  let hash = 0
  for (let i = 0; i < Math.min(name.length, 5); i++) {
    hash += name.codePointAt(i) ?? 0
  }
  
  return colors[hash % colors.length]
}

export const OrganizationLogo: React.FC<OrganizationLogoProps> = ({
  logoUrl,
  organizationName,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false)

  const safeName = (organizationName || '').trim() || 'Organization'
  const firstLetter = safeName.charAt(0).toUpperCase()
  const placeholderColor = getPlaceholderColor(safeName)

  // Show placeholder if no logo URL or if there was an error loading the image
  if (!logoUrl || hasError) {
    return (
      <div
        className={`${sizeClasses[size]} ${placeholderColor} rounded-lg flex items-center justify-center text-white font-bold shrink-0 ${className}`}
        aria-label={`${safeName} placeholder`}
      >
        {firstLetter}
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 ${className}`}>
      <img
        src={logoUrl}
        alt={`${safeName} logo`}
        className="w-full h-full object-contain p-1"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  )
}

export default OrganizationLogo
