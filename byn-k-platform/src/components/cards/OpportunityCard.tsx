import React from 'react'
import { Calendar, CheckCircle2, ExternalLink } from 'lucide-react'
import { OpportunityCardProps } from '@/types'

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  organizationName,
  category,
  documentation,
  deadline,
  isVerified,
  applyLink,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Row: Organization & Verified Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          {organizationName}
        </span>
        {isVerified && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 size={12} />
            Verified
          </div>
        )}
      </div>

      {/* Middle: Title & Category */}
      <h3 className="text-xl font-bold text-[#0F4C81] mb-2 leading-tight">
        {title}
      </h3>
      <div className="inline-block bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold mb-4">
        {category}
      </div>

      {/* Documentation Section (The Case Study Highlight) */}
      <div className="mb-6">
        <p className="text-xs text-slate-400 mb-2">Accepted Documentation:</p>
        <div className="flex flex-wrap gap-2">
          {documentation.map((doc) => (
            <span 
              key={doc}
              className="bg-blue-50 text-[#0F4C81] border border-blue-100 px-2 py-1 rounded-md text-xs font-medium"
            >
              {doc.replace('_', ' ').toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Footer: Deadline & Action */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Calendar size={16} />
          <span>Due: {new Date(deadline).toLocaleDateString()}</span>
        </div>
        <a 
          href={applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#d98c1d] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
        >
          Apply <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}