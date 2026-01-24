import React from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle2, ExternalLink, Mail, Star } from 'lucide-react'
import { OpportunityCardProps, generateSlug } from '@/types'

// Helper function to calculate days remaining
const getDaysRemaining = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get category label color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'job':
      return 'text-[#F5D300] bg-yellow-50'
    case 'scholarship':
      return 'text-purple-600 bg-purple-50'
    case 'internship':
      return 'text-[#2D8FDD] bg-blue-50'
    case 'training':
    case 'fellowship':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-slate-600 bg-slate-100'
  }
}

// Generate mailto link for email applications
const generateMailtoLink = (email: string, subject?: string | null) => {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${subjectParam}`
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  slug,
  title,
  organizationName,
  category,
  documentation,
  deadline,
  isVerified,
  applicationType,
  applyLink,
  applicationEmail,
  emailSubjectLine,
}) => {
  const daysRemaining = getDaysRemaining(deadline)
  const categoryColorClass = getCategoryColor(category)
  // Use provided slug or generate from title
  const opportunitySlug = slug || generateSlug(title)
  const detailLink = `/opportunities/${opportunitySlug}`

  // Determine the apply action based on application type
  const isEmailApplication = applicationType === 'email'
  const applyUrl = isEmailApplication 
    ? (applicationEmail ? generateMailtoLink(applicationEmail, emailSubjectLine) : '#')
    : (applyLink || '#')

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Save Star Icon */}
      <button 
        className="absolute top-4 right-4 text-slate-300 hover:text-[#F5D300] transition-colors"
        aria-label="Save opportunity"
      >
        <Star size={20} />
      </button>

      {/* Top Row: Organization & Verified Badge */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span className="text-sm font-medium text-slate-500">
          {organizationName}
        </span>
        {isVerified && (
          <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-2 py-0.5 rounded-full text-xs font-semibold">
            <CheckCircle2 size={12} />
            Verified
          </div>
        )}
      </div>

      {/* Title */}
      <Link href={detailLink}>
        <h3 className="text-lg sm:text-xl font-bold text-[#2D8FDD] mb-3 leading-tight pr-8 hover:text-[#1E6BB8] transition-colors cursor-pointer">
          {title}
        </h3>
      </Link>

      {/* Category & Deadline Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded font-semibold uppercase ${categoryColorClass}`}>
          {category}
        </span>
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-slate-400" />
          <span className={daysRemaining <= 7 ? 'text-[#D52B2B] font-semibold' : 'text-slate-500'}>
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
          </span>
        </div>
        {/* Application Type Indicator */}
        {isEmailApplication && (
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            <Mail size={12} />
            Email
          </div>
        )}
      </div>

      {/* Documentation Badges */}
      {documentation && documentation.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Accepted ID:</p>
          <div className="flex flex-wrap gap-2">
            {documentation.map((doc) => (
              <span 
                key={doc}
                className="bg-[#2D8FDD]/5 text-[#2D8FDD] border border-[#2D8FDD]/20 px-2 py-1 rounded-md text-xs font-medium"
              >
                {doc.replace('_', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="flex gap-2">
        <Link 
          href={detailLink}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#2D8FDD] px-4 py-3 rounded-lg font-bold text-sm transition-colors"
        >
          View Details
        </Link>
        <a 
          href={applyUrl}
          target={isEmailApplication ? undefined : '_blank'}
          rel={isEmailApplication ? undefined : 'noopener noreferrer'}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors"
        >
          {isEmailApplication ? (
            <>Apply via Email <Mail size={14} /></>
          ) : (
            <>Apply Now <ExternalLink size={14} /></>
          )}
        </a>
      </div>
    </div>
  )
}