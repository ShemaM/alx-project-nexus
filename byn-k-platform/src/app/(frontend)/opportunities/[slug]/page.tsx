import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Calendar, CheckCircle2, MapPin, Building2, FileText, Mail, Download, Paperclip } from 'lucide-react'
import { getOpportunityBySlug, getBrochureUrl } from '@/lib/api'
import OpportunityActions from '@/components/ui/OpportunityActions'

// Force dynamic rendering to fetch data at runtime (requires database connection)
export const dynamic = 'force-dynamic'

// Helper function to calculate days remaining
const getDaysRemaining = (deadline: string | null) => {
  if (!deadline) return null
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
    case 'jobs':
      return 'text-[#F5D300] bg-yellow-50 border-yellow-200'
    case 'scholarship':
    case 'scholarships':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'internship':
    case 'internships':
      return 'text-[#2D8FDD] bg-blue-50 border-blue-200'
    case 'fellowship':
    case 'fellowships':
    case 'training':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'TBD'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper to generate mailto link
const generateMailtoLink = (email: string, subject?: string | null) => {
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${subjectParam}`
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  let opportunity = null
  
  try {
    // Use slug-based lookup for SEO-friendly URLs
    opportunity = await getOpportunityBySlug(slug)
  } catch (error) {
    console.error('Error fetching opportunity:', error)
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Opportunity Not Found</h1>
          <p className="text-slate-600 mb-8">The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#2D8FDD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1E6BB8] transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(opportunity.deadline || null)
  const displayCategory = opportunity.category || 'job'
  const categoryColorClass = getCategoryColor(displayCategory)
  const organizationName = opportunity.organization_name
  
  // Application method handling
  const isEmailApplication = opportunity.application_type === 'email'
  const applyUrl = isEmailApplication 
    ? (opportunity.application_email ? generateMailtoLink(opportunity.application_email, opportunity.email_subject_line) : '#')
    : (opportunity.external_url || '#')
  
  // Document handling
  const hasBrochure = opportunity.application_type === 'pdf' && opportunity.brochure_url
  const brochureUrl = hasBrochure ? getBrochureUrl(opportunity.id) : null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#2D8FDD] hover:text-[#1E6BB8] font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Opportunities
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase border ${categoryColorClass}`}>
                {displayCategory}
              </span>
              {opportunity.is_verified && (
                <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 size={14} />
                  Verified
                </div>
              )}
              {/* Application Method Badge */}
              {isEmailApplication && (
                <div className="flex items-center gap-1 bg-blue-50 text-[#2D8FDD] px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200">
                  <Mail size={14} />
                  Email Application
                </div>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-4">
              {opportunity.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-slate-400" />
                <span className="font-medium">{organizationName}</span>
              </div>
              {opportunity.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="capitalize">{opportunity.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-8 bg-slate-50 border-b border-[#E2E8F0]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2D8FDD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#2D8FDD]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Deadline</p>
                <p className={`font-semibold ${daysRemaining !== null && daysRemaining <= 7 ? 'text-[#D52B2B]' : 'text-slate-900'}`}>
                  {formatDate(opportunity.deadline || null)}
                </p>
                {daysRemaining !== null && (
                  <p className={`text-sm ${daysRemaining <= 7 ? 'text-[#D52B2B]' : 'text-slate-500'}`}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                  </p>
                )}
              </div>
            </div>
            
            {opportunity.required_documents && opportunity.required_documents.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#2D8FDD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-[#2D8FDD]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Accepted Documents</p>
                  <div className="flex flex-wrap gap-1">
                    {opportunity.required_documents.map((doc) => (
                      <span 
                        key={doc}
                        className="bg-white text-[#2D8FDD] border border-[#2D8FDD]/20 px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {doc.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2D8FDD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#2D8FDD]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Posted</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(opportunity.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Email Application Requirements */}
          {isEmailApplication && opportunity.application_email && (
            <div className="p-6 md:p-8 border-b border-[#E2E8F0] bg-blue-50/50">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Mail size={20} className="text-[#2D8FDD]" />
                How to Apply
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Paperclip size={18} className="text-[#2D8FDD] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Send your application to:</p>
                    <a 
                      href={`mailto:${opportunity.application_email}`}
                      className="text-[#2D8FDD] hover:underline font-semibold"
                    >
                      {opportunity.application_email}
                    </a>
                  </div>
                </div>
                {opportunity.email_subject_line && (
                  <div className="flex items-start gap-3">
                    <FileText size={18} className="text-[#2D8FDD] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Subject Line:</p>
                      <p className="text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200 inline-block mt-1">
                        {opportunity.email_subject_line}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PDF Brochure Download */}
          {hasBrochure && brochureUrl && (
            <div className="p-6 md:p-8 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Opportunity Details</h2>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2D8FDD]/10 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-[#2D8FDD]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Opportunity Details Document</p>
                      <p className="text-sm text-slate-500">Download the full document for complete information</p>
                    </div>
                  </div>
                  <a 
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Prep Checklist */}
          {opportunity.prep_checklist && opportunity.prep_checklist.length > 0 && (
            <div className="p-6 md:p-8 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Preparation Checklist</h2>
              <ul className="space-y-2">
                {opportunity.prep_checklist.map((item, index) => {
                  const itemText = typeof item === 'string' ? item : (item && typeof item === 'object' ? item.item : String(item))
                  const isRequired = typeof item === 'object' && item !== null && 'required' in item && item.required
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-[#27AE60] mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">
                        {itemText}
                        {isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Actions */}
          <OpportunityActions 
            opportunityId={String(opportunity.id)}
            title={opportunity.title}
            applyUrl={applyUrl}
            isEmailApplication={isEmailApplication}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
