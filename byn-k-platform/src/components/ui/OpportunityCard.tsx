/**
 * OpportunityCard Component
 * 
 * Displays an opportunity card with organization branding.
 * Features:
 * - Organization logo display with Next.js Image optimization
 * - Fallback placeholder with first letter when no logo is provided
 * - Category badges with appropriate colors
 * - Deadline display with urgency indicators
 * - Magical hover effects and animations
 * 
 * @module components/ui/OpportunityCard
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle2, FileText, MapPin, Sparkles } from 'lucide-react'
import { Opportunity, OpportunityCategory } from '@/types'
import { OrganizationLogo } from './OrganizationLogo'
import { buildOpportunityPath } from '@/lib/opportunity-utils'
import { addActivity } from '@/lib/opportunity-activity'

interface OpportunityCardProps {
  opportunity: Opportunity
  className?: string
  featured?: boolean
}

// Category badge colors with gradient support
const categoryColors: Record<OpportunityCategory, { bg: string; border: string; text: string; glow: string }> = {
  job: { 
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', 
    border: 'border-yellow-200', 
    text: 'text-yellow-700',
    glow: 'group-hover:shadow-yellow-200/50'
  },
  scholarship: { 
    bg: 'bg-gradient-to-r from-purple-50 to-violet-50', 
    border: 'border-purple-200', 
    text: 'text-purple-700',
    glow: 'group-hover:shadow-purple-200/50'
  },
  internship: { 
    bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', 
    border: 'border-blue-200', 
    text: 'text-blue-700',
    glow: 'group-hover:shadow-blue-200/50'
  },
  fellowship: { 
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50', 
    border: 'border-green-200', 
    text: 'text-green-700',
    glow: 'group-hover:shadow-green-200/50'
  },
  training: { 
    bg: 'bg-gradient-to-r from-orange-50 to-amber-50', 
    border: 'border-orange-200', 
    text: 'text-orange-700',
    glow: 'group-hover:shadow-orange-200/50'
  },
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
  featured = false,
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
    brochure_url,
    is_verified,
    days_until_deadline,
  } = opportunity

  const categoryStyle = categoryColors[category] || categoryColors.job
  const categoryLabel = categoryLabels[category] || 'Opportunity'

  // Determine if deadline is urgent (7 days or less)
  const isUrgent = days_until_deadline !== null && days_until_deadline !== undefined && days_until_deadline <= 7 && days_until_deadline >= 0

  const opportunityUrl = buildOpportunityPath(category, slug)

  return (
    <Link
      href={opportunityUrl}
      onClick={() =>
        addActivity('viewed', {
          id,
          title,
          organizationName: organization_name,
          category,
          slug,
          url: opportunityUrl,
        })
      }
      className={`group relative block bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1
        ${featured ? 'ring-2 ring-[#F5D300]/50' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D8FDD]/0 via-transparent to-[#F5D300]/0 group-hover:from-[#2D8FDD]/5 group-hover:to-[#F5D300]/5 transition-all duration-300 pointer-events-none" />
      
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#F5D300] to-[#D4B500] text-white px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1 shadow-md">
          <Sparkles size={12} />
          Featured
        </div>
      )}

      <div className="relative p-5">
        {/* Header: Logo + Organization Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <OrganizationLogo
              logoUrl={org_logo_url}
              organizationName={organization_name}
              size="md"
            />
            {/* Subtle glow effect behind logo on hover */}
            <div className="absolute inset-0 bg-[#2D8FDD]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle.bg} ${categoryStyle.border} ${categoryStyle.text} transition-all duration-200 group-hover:shadow-sm`}>
                {categoryLabel}
              </span>
              {is_verified && (
                <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              )}
              {brochure_url && (
                <span className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium">
                  <FileText size={12} />
                  Brochure
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2D8FDD] transition-colors duration-200 line-clamp-2">
              {title}
            </h3>
            
            {/* Organization Name */}
            <p className="text-sm text-slate-600 mt-1 truncate group-hover:text-slate-700 transition-colors">
              {organization_name}
            </p>
          </div>
        </div>
        
        {/* Footer: Location + Deadline */}
        <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-100 group-hover:border-slate-200 transition-colors">
          {/* Location */}
          <div className="flex items-center gap-1.5 group-hover:text-slate-700 transition-colors">
            <MapPin size={14} className="text-slate-400 group-hover:text-[#2D8FDD] transition-colors" />
            <span className="capitalize">
              {city || location || 'Remote'}
            </span>
          </div>
          
          {/* Deadline */}
          {deadline && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200 ${
              isUrgent 
                ? 'text-red-600 font-semibold bg-red-50 animate-pulse' 
                : 'group-hover:bg-slate-50'
            }`}>
              <Calendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400 group-hover:text-[#2D8FDD] transition-colors'} />
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

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D8FDD] via-[#F5D300] to-[#D52B2B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  )
}

export default OpportunityCard
