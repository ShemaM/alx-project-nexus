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
import { Calendar, CheckCircle2, MapPin } from 'lucide-react'
import { Opportunity, OpportunityCategory } from '@/types'
import { OrganizationLogo } from './OrganizationLogo'

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
