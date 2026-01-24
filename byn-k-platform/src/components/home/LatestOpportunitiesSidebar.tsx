import React from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle2, TrendingUp } from 'lucide-react'
import type { TransformedOpportunity } from '@/components/home/HomeContent'

interface LatestOpportunitiesSidebarProps {
  opportunities: TransformedOpportunity[]
}

// Helper function to calculate days remaining
const getDaysRemaining = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get category color classes
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'job':
    case 'jobs':
      return 'text-[#F5A623] bg-orange-50'
    case 'scholarship':
    case 'scholarships':
      return 'text-purple-600 bg-purple-50'
    case 'internship':
    case 'internships':
      return 'text-blue-600 bg-blue-50'
    case 'fellowship':
    case 'fellowships':
    case 'training':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-slate-600 bg-slate-100'
  }
}

// Format time since posting
const getTimeSincePosted = (createdAt: string) => {
  const now = new Date()
  const posted = new Date(createdAt)
  const diffTime = now.getTime() - posted.getTime()
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const LatestOpportunitiesSidebar: React.FC<LatestOpportunitiesSidebarProps> = ({
  opportunities,
}) => {
  if (opportunities.length === 0) {
    return null
  }

  return (
    <aside className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm sticky top-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
        <div className="w-8 h-8 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center">
          <TrendingUp size={18} className="text-[#0F4C81]" />
        </div>
        <div>
          <h3 className="font-bold text-[#0F4C81]">Latest Opportunities</h3>
          <p className="text-xs text-slate-500">Recently posted</p>
        </div>
      </div>

      {/* Opportunity List */}
      <div className="space-y-3">
        {opportunities.map((opportunity) => {
          const categoryColorClass = getCategoryColor(opportunity.category)
          const daysRemaining = getDaysRemaining(opportunity.deadline)

          return (
            <Link
              key={opportunity.id}
              href={`/opportunities/${opportunity.slug}`}
              className="block p-3 rounded-lg border border-[#E2E8F0] hover:border-[#0F4C81]/30 hover:bg-slate-50 transition-all group"
            >
              {/* Category & Time */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${categoryColorClass}`}>
                  {opportunity.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {getTimeSincePosted(opportunity.createdAt)}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-[#0F4C81] transition-colors line-clamp-2 mb-1">
                {opportunity.title}
              </h4>

              {/* Organization */}
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                {opportunity.organizationName}
                {opportunity.isVerified && (
                  <CheckCircle2 size={12} className="text-[#27AE60]" />
                )}
              </p>

              {/* Deadline */}
              <div className="flex items-center gap-1 text-xs">
                <Calendar size={12} className="text-slate-400" />
                <span className={daysRemaining <= 7 ? 'text-[#F5A623] font-medium' : 'text-slate-500'}>
                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Deadline passed'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* View All Link */}
      <Link
        href="/categories/jobs"
        className="block mt-4 pt-3 border-t border-[#E2E8F0] text-center text-sm font-semibold text-[#0F4C81] hover:text-[#0d3f6b] transition-colors"
      >
        View All Opportunities →
      </Link>
    </aside>
  )
}
