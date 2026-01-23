import React from 'react'
import { Calendar, CheckCircle2, ExternalLink, Star } from 'lucide-react'
import { OpportunityCardProps } from '@/types'

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
      return 'text-[#F5A623] bg-orange-50'
    case 'scholarship':
      return 'text-purple-600 bg-purple-50'
    case 'internship':
      return 'text-blue-600 bg-blue-50'
    case 'training':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-slate-600 bg-slate-100'
  }
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  organizationName,
  category,
  documentation,
  deadline,
  isVerified,
  applyLink,
}) => {
  const daysRemaining = getDaysRemaining(deadline)
  const categoryColorClass = getCategoryColor(category)

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Save Star Icon */}
      <button 
        className="absolute top-4 right-4 text-slate-300 hover:text-[#F5A623] transition-colors"
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
      <h3 className="text-lg sm:text-xl font-bold text-[#0F4C81] mb-3 leading-tight pr-8">
        {title}
      </h3>

      {/* Category & Deadline Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`text-xs px-2 py-1 rounded font-semibold uppercase ${categoryColorClass}`}>
          {category}
        </span>
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} className="text-slate-400" />
          <span className={daysRemaining <= 7 ? 'text-[#F5A623] font-semibold' : 'text-slate-500'}>
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
          </span>
        </div>
      </div>

      {/* Documentation Badges */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Accepted ID:</p>
        <div className="flex flex-wrap gap-2">
          {documentation.map((doc) => (
            <span 
              key={doc}
              className="bg-[#0F4C81]/5 text-[#0F4C81] border border-[#0F4C81]/20 px-2 py-1 rounded-md text-xs font-medium"
            >
              {doc.replace('_', ' ').toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <a 
        href={applyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#0F4C81] hover:bg-[#0d3f6b] text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors"
      >
        Apply Now <ExternalLink size={14} />
      </a>
    </div>
  )
}