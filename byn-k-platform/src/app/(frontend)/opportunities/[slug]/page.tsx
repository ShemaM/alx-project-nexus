import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Building2,
  FileText,
  Mail,
  Eye,
  Paperclip,
  ExternalLink,
} from 'lucide-react'
import { getOpportunityBySlug, getBrochureUrl } from '@/lib/api'
import OpportunityActions from '@/components/ui/OpportunityActions'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import ShareButton from '@/components/ui/ShareButton'
import OpportunityActivityTracker from '@/components/ui/OpportunityActivityTracker'
import BookmarkButton from '@/components/ui/BookmarkButton'

// Use ISR with revalidation instead of force-dynamic for better performance
// Pages are cached and revalidated every 60 seconds
export const revalidate = 60

const getDaysRemaining = (deadline: string | null) => {
  if (!deadline) return null
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'job':
    case 'jobs':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'scholarship':
    case 'scholarships':
      return 'bg-purple-100 text-purple-700 border-purple-300'
    case 'internship':
    case 'internships':
      return 'bg-sky-100 text-sky-700 border-sky-300'
    case 'fellowship':
    case 'fellowships':
    case 'training':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300'
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
  const orgLogoUrl = opportunity.org_logo_url

  const isEmailApplication = opportunity.application_type === 'email'
  const applyUrl = isEmailApplication
    ? (opportunity.application_email ? generateMailtoLink(opportunity.application_email, opportunity.email_subject_line) : '#')
    : (opportunity.external_url || '#')

  const hasBrochure = Boolean(opportunity.brochure_url)
  const brochureUrl = hasBrochure ? getBrochureUrl(opportunity.id) : null

  const aboutText =
    opportunity.description_en ||
    opportunity.description_sw ||
    opportunity.description_fr ||
    `${opportunity.title} by ${organizationName}. Review the full details and apply using the instructions below.`

  const prepChecklist = Array.isArray(opportunity.prep_checklist) ? opportunity.prep_checklist : []
  const requiredDocs = Array.isArray(opportunity.required_documents) ? opportunity.required_documents : []

  const benefits = [
    opportunity.is_verified ? 'Verified opportunity listing' : null,
    opportunity.work_mode ? `Flexible ${opportunity.work_mode === 'onsite' ? 'On-site' : opportunity.work_mode} work mode` : null,
    opportunity.is_paid ? 'Paid opportunity' : null,
    opportunity.funding_type ? `${String(opportunity.funding_type).replace('_', ' ')} support available` : null,
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#EEF3FA]">
      <Navbar />
      <OpportunityActivityTracker
        id={opportunity.id}
        title={opportunity.title}
        organizationName={organizationName}
        category={opportunity.category}
        slug={opportunity.slug}
      />

      <header className="border-b border-[#DDE7F3] bg-gradient-to-r from-[#F7FBFF] via-[#F2F8FF] to-[#F7FBFF]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/opportunities" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors mb-4">
            <ArrowLeft size={14} />
            Back to Opportunities
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${categoryColorClass}`}>
                  {displayCategory}
                </span>
                {opportunity.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold border bg-emerald-100 text-emerald-700 border-emerald-300">
                    <CheckCircle2 size={13} />
                    Verified
                  </span>
                )}
                {opportunity.is_featured && (
                  <span className="text-xs px-3 py-1 rounded-full font-bold border bg-amber-100 text-amber-700 border-amber-300">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black text-slate-900 mb-4">{opportunity.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <div className="flex items-center gap-3">
                  <OrganizationLogo logoUrl={orgLogoUrl} organizationName={organizationName} size="md" />
                  <div>
                    <p className="font-semibold text-slate-900">{organizationName}</p>
                    <p className="text-xs text-emerald-600 font-medium">Verified Partner</p>
                  </div>
                </div>
                {opportunity.location && (
                  <div className="inline-flex items-center gap-1.5 text-sm">
                    <MapPin size={14} />
                    <span className="capitalize">{opportunity.location}</span>
                  </div>
                )}
                {opportunity.work_mode && (
                  <span className="text-sm capitalize">{opportunity.work_mode === 'onsite' ? 'On-site' : opportunity.work_mode}</span>
                )}
              </div>
            </div>

            <div className="hidden sm:flex flex-col gap-2">
              <BookmarkButton
                opportunityId={opportunity.id}
                title={opportunity.title}
                organizationName={organizationName}
                category={opportunity.category}
                slug={opportunity.slug}
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#2D8FDD] transition-colors"
              />
              <ShareButton
                title={opportunity.title}
                className="!w-9 !h-9 !px-0 !py-0 !rounded-lg !border !border-slate-200 !bg-white !text-slate-500 hover:!text-[#2D8FDD] !font-normal"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">About This Opportunity</h2>
              <p className="text-slate-600 leading-7 text-[15px]">{aboutText}</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
              {prepChecklist.length > 0 ? (
                <ul className="space-y-2">
                  {prepChecklist.map((item, index) => {
                    const itemText = typeof item === 'string' ? item : (item?.item || String(item))
                    return (
                      <li key={index} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{itemText}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-slate-600">No specific requirements listed.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Benefits</h2>
              {benefits.length > 0 ? (
                <ul className="space-y-2">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 size={16} className="text-[#2D8FDD] mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">Benefits information is provided in the application details.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Required Documents</h2>
              {requiredDocs.length > 0 ? (
                <ul className="space-y-2">
                  {requiredDocs.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-slate-700">
                      <Paperclip size={15} className="text-slate-400" />
                      <span>{doc.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">No required documents listed.</p>
              )}
            </div>

            <div className="bg-linear-to-r from-[#EAF3FF] to-[#F5F9FF] rounded-2xl border border-[#87BDF0] p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Apply?</h2>
              <p className="text-slate-600 mb-4">Make sure you have all required information prepared before submitting your application.</p>
              <a
                href={applyUrl}
                target={isEmailApplication ? undefined : '_blank'}
                rel={isEmailApplication ? undefined : 'noopener noreferrer'}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-5 py-3 font-bold transition-colors"
              >
                Apply Now
                <ExternalLink size={16} />
              </a>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Application Deadline</p>
                  <p className={`font-bold ${daysRemaining !== null && daysRemaining <= 7 ? 'text-red-600' : 'text-slate-900'}`}>
                    {formatDate(opportunity.deadline || null)}
                  </p>
                  {daysRemaining !== null && (
                    <p className={`text-xs mt-1 ${daysRemaining <= 7 ? 'text-red-500' : 'text-slate-500'}`}>
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Location</p>
                  <p className="font-semibold text-slate-900">{opportunity.city || opportunity.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Work Type</p>
                  <p className="font-semibold text-slate-900 capitalize">
                    {opportunity.work_mode ? (opportunity.work_mode === 'onsite' ? 'On-site' : opportunity.work_mode) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Posted Date</p>
                  <p className="font-semibold text-slate-900">{formatDate(opportunity.created_at)}</p>
                </div>
              </div>

              <a
                href={applyUrl}
                target={isEmailApplication ? undefined : '_blank'}
                rel={isEmailApplication ? undefined : 'noopener noreferrer'}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-4 py-3 font-bold transition-colors"
              >
                Apply Now
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-4">About the Organization</h3>
              <div className="flex items-center gap-3">
                <OrganizationLogo logoUrl={orgLogoUrl} organizationName={organizationName} size="md" />
                <div>
                  <p className="font-semibold text-slate-900">{organizationName}</p>
                  <p className="text-xs text-emerald-600 font-medium">Verified Partner</p>
                </div>
              </div>
              <Link href="/opportunities" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 hover:bg-slate-50 font-semibold">
                <Building2 size={15} />
                View All Opportunities
              </Link>
            </div>

            <div className="bg-linear-to-r from-[#EAF3FF] to-[#F5F9FF] rounded-2xl border border-[#87BDF0] p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Share This Opportunity</h3>
              <p className="text-sm text-slate-600 mb-4">Help others discover this opportunity.</p>
              <ShareButton title={opportunity.title} className="w-full !py-2.5 !bg-[#2D8FDD] hover:!bg-[#1E6BB8] !text-white !border-[#2D8FDD]" />
            </div>

            {isEmailApplication && opportunity.application_email && (
              <div className="bg-white rounded-2xl border border-[#DDE7F3] p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Email Application</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-slate-700">
                    <Mail size={14} className="text-[#2D8FDD]" />
                    {opportunity.application_email}
                  </p>
                  {opportunity.email_subject_line && (
                    <p className="text-slate-600">
                      Subject: <span className="font-medium">{opportunity.email_subject_line}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {hasBrochure && brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-[#DDE7F3] p-5 flex items-center justify-between text-slate-800 hover:border-[#2D8FDD] transition-colors"
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <FileText size={16} className="text-[#2D8FDD]" />
                  Preview Brochure
                </span>
                <Eye size={16} className="text-[#2D8FDD]" />
              </a>
            )}
          </aside>
        </div>

        <div className="mt-6">
          <OpportunityActions
            opportunityId={String(opportunity.id)}
            title={opportunity.title}
            organizationName={organizationName}
            category={opportunity.category}
            slug={opportunity.slug}
            applyUrl={applyUrl}
            isEmailApplication={isEmailApplication}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
