/**
 * OpportunityCard Component
 * 
 * Displays an opportunity card with organization branding.
 * Features:
 * - Organization logo display with Next.js Image optimization
 * - Fallback placeholder with first letter when no logo is provided
 * - Category badges with appropriate colors
 * - Deadline display with urgency indicators
 * 
 * @module components/ui/OpportunityCard
 */
'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, CheckCircle2, MapPin } from 'lucide-react'
import { Opportunity, OpportunityCategory } from '@/types'

interface OpportunityCardProps {
  opportunity: Opportunity
  className?: string
}

// Category badge colors
const categoryColors: Record<OpportunityCategory, string> = {
  job: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  scholarship: 'bg-purple-100 text-purple-800 border-purple-200',
  internship: 'bg-blue-100 text-blue-800 border-blue-200',
  fellowship: 'bg-green-100 text-green-800 border-green-200',
  training: 'bg-orange-100 text-orange-800 border-orange-200',
}

// Category labels
const categoryLabels: Record<OpportunityCategory, string> = {
  job: 'Job',
  scholarship: 'Scholarship',
  internship: 'Internship',
  fellowship: 'Fellowship',
  training: 'Training',
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
    hash += name.charCodeAt(i)
  }
  
  return colors[hash % colors.length]
}

// Organization Logo component with fallback
const OrganizationLogo: React.FC<{
  logoUrl?: string | null
  organizationName: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ logoUrl, organizationName, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
  }

  const imageSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const firstLetter = organizationName.trim().charAt(0).toUpperCase()
  const placeholderColor = getPlaceholderColor(organizationName)

  if (logoUrl) {
    return (
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0`}>
        <Image
          src={logoUrl}
          alt={`${organizationName} logo`}
          fill
          sizes={`${imageSizes[size]}px`}
          className="object-contain p-1"
          onError={(e) => {
            // Hide the image on error and show placeholder
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<span class="flex items-center justify-center w-full h-full ${placeholderColor} text-white font-bold">${firstLetter}</span>`
            }
          }}
        />
      </div>
    )
  }

  // Fallback: Stylized placeholder with first letter
  return (
    <div
      className={`${sizeClasses[size]} ${placeholderColor} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
      aria-label={`${organizationName} placeholder`}
    >
      {firstLetter}
    </div>
  )
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  className = '',
}) => {
  const {
    id,
    slug,
    title,
    organization_name,
    org_logo_url,
    category = 'job',
    location,
    city,
    deadline,
    is_verified,
    days_until_deadline,
  } = opportunity

  const categoryColor = categoryColors[category] || categoryColors.job
  const categoryLabel = categoryLabels[category] || 'Opportunity'

  // Determine if deadline is urgent (7 days or less)
  const isUrgent = days_until_deadline !== null && days_until_deadline !== undefined && days_until_deadline <= 7 && days_until_deadline >= 0

  const opportunityUrl = slug ? `/opportunities/${slug}` : `/opportunities/${id}`

  return (
    <Link
      href={opportunityUrl}
      className={`group block bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden ${className}`}
    >
      <div className="p-5">
        {/* Header: Logo + Organization Info */}
        <div className="flex items-start gap-4 mb-4">
          <OrganizationLogo
            logoUrl={org_logo_url}
            organizationName={organization_name}
            size="md"
          />
          
          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColor}`}>
                {categoryLabel}
              </span>
              {is_verified && (
                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2D8FDD] transition-colors line-clamp-2">
              {title}
            </h3>
            
            {/* Organization Name */}
            <p className="text-sm text-slate-600 mt-1 truncate">
              {organization_name}
            </p>
          </div>
        </div>
        
        {/* Footer: Location + Deadline */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100">
          {/* Location */}
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            <span className="capitalize">
              {city || location || 'Remote'}
            </span>
          </div>
          
          {/* Deadline */}
          {deadline && (
            <div className={`flex items-center gap-1.5 ${isUrgent ? 'text-red-600 font-medium' : ''}`}>
              <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
              <span>
                {isUrgent && days_until_deadline !== null
                  ? `${days_until_deadline} days left`
                  : new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default OpportunityCard
