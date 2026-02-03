import React from 'react'
import Link from 'next/link'
import { Calendar, CheckCircle2, ExternalLink, Mail, FileText, ClipboardList, MapPin } from 'lucide-react'
import { OpportunityCardProps, generateSlug, documentTypeLabels, applicationTypeLabels, PrepChecklistItem } from '@/types'
import BookmarkButton from '@/components/ui/BookmarkButton'

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

// Get document label for display
const getDocumentLabel = (doc: string): string => {
  return documentTypeLabels[doc as keyof typeof documentTypeLabels] || doc.replace('_', ' ').toUpperCase()
}

// Get action button text based on application type
const getActionButtonText = (applicationType: string): string => {
  return applicationTypeLabels[applicationType as keyof typeof applicationTypeLabels] || 'Apply Now'
}

// Preparation Checklist Component
const PreparationChecklist: React.FC<{ items: PrepChecklistItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null
  
  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList size={14} className="text-amber-600" />
        <span className="text-xs font-semibold text-amber-700 uppercase">Preparation Checklist</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>
              {item.item}
              {item.required && <span className="text-red-500 ml-1">*</span>}
              {item.description && (
                <span className="text-amber-600 text-xs ml-1">({item.description})</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-amber-600 mt-2 italic">
        Note: Ensure you have these documents ready before applying.
      </p>
    </div>
  )
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  id,
  slug,
  title,
  organizationName,
  category,
  documentation,
  deadline,
  isVerified,
  location,
  applicationType,
  applyLink,
  applicationEmail,
  emailSubjectLine,
  brochureUrl,
  prepChecklist,
}) => {
  const daysRemaining = getDaysRemaining(deadline)
  const categoryColorClass = getCategoryColor(category)
  // Use provided slug or generate from title
  const opportunitySlug = slug || generateSlug(title)
  const detailLink = `/opportunities/${opportunitySlug}`

  // Determine the apply action based on application type
  const getApplyUrl = (): string => {
    switch (applicationType) {
      case 'email':
        return applicationEmail ? generateMailtoLink(applicationEmail, emailSubjectLine) : '#'
      case 'pdf':
        return brochureUrl || '#'
      case 'link':
      default:
        return applyLink || '#'
    }
  }

  const applyUrl = getApplyUrl()

  // Get action button icon based on application type
  const getActionIcon = () => {
    switch (applicationType) {
      case 'email':
        return <Mail size={14} />
      case 'pdf':
        return <FileText size={14} />
      case 'link':
      default:
        return <ExternalLink size={14} />
    }
  }

  // Get target attribute based on application type
  const getTargetAttribute = (): '_blank' | undefined => {
    return applicationType === 'email' ? undefined : '_blank'
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Bookmark Button */}
      {id && (
        <BookmarkButton 
          opportunityId={id}
          className="absolute top-4 right-4"
        />
      )}

      {/* Top Row: Organization & Verified Badge */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span className="text-sm font-medium text-slate-500">
          {organizationName}
        </span>
        {isVerified && (
          <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-2 py-0.5 rounded-full text-xs font-semibold">
            <CheckCircle2 size={12} />
            WhatsApp Verified
          </div>
        )}
      </div>

      {/* Title */}
      <Link href={detailLink}>
        <h3 className="text-lg sm:text-xl font-bold text-[#2D8FDD] mb-3 leading-tight pr-8 hover:text-[#1E6BB8] transition-colors cursor-pointer">
          {title}
        </h3>
      </Link>

      {/* Location (if available) */}
      {location && (
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
          <MapPin size={14} className="text-slate-400" />
          <span>{location}</span>
        </div>
      )}

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
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {applicationType === 'email' && <Mail size={12} />}
          {applicationType === 'pdf' && <FileText size={12} />}
          {applicationType === 'link' && <ExternalLink size={12} />}
          {applicationType === 'email' ? 'Email' : applicationType === 'pdf' ? 'PDF' : 'Link'}
        </div>
      </div>

      {/* Documentation Badges (Required Documents/Accepted IDs) */}
      {documentation && documentation.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-2">Accepted ID:</p>
          <div className="flex flex-wrap gap-2">
            {documentation.map((doc) => (
              <span 
                key={doc}
                className="bg-[#2D8FDD]/5 text-[#2D8FDD] border border-[#2D8FDD]/20 px-2 py-1 rounded-md text-xs font-medium"
              >
                {getDocumentLabel(doc)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preparation Checklist Section */}
      {prepChecklist && prepChecklist.length > 0 && (
        <PreparationChecklist items={prepChecklist} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link 
          href={detailLink}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#2D8FDD] px-4 py-3 rounded-lg font-bold text-sm transition-colors"
        >
          View Details
        </Link>
        <a 
          href={applyUrl}
          target={getTargetAttribute()}
          rel={applicationType !== 'email' ? 'noopener noreferrer' : undefined}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-4 py-3 rounded-lg font-bold text-sm transition-colors"
        >
          {getActionButtonText(applicationType)} {getActionIcon()}
        </a>
      </div>
    </div>
  )
}