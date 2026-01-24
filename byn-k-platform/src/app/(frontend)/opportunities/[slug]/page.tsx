import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, MapPin, Building2, FileText, Share2 } from 'lucide-react'
import { generateSlug } from '@/types'
import { getOpportunities, getOrganizationName, mapCategoryForDisplay } from '@/lib/payload'
import type { Opportunity } from '@/payload-types'

// Force dynamic rendering to fetch data at runtime (requires database connection)
export const dynamic = 'force-dynamic'

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
    case 'jobs':
      return 'text-[#F5A623] bg-orange-50 border-orange-200'
    case 'scholarship':
    case 'scholarships':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'internship':
    case 'internships':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'fellowship':
    case 'fellowships':
    case 'training':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper to extract plain text from rich text content
const extractTextFromRichText = (description: Opportunity['description']): string => {
  if (!description || !description.root || !description.root.children) {
    return 'No description available.'
  }
  
  // Type guard for text node
  const isTextNode = (node: unknown): node is { text: string } => {
    return typeof node === 'object' && node !== null && 'text' in node && typeof (node as { text: unknown }).text === 'string'
  }
  
  // Type guard for node with children
  const hasChildren = (node: unknown): node is { children: unknown[] } => {
    return typeof node === 'object' && node !== null && 'children' in node && Array.isArray((node as { children: unknown }).children)
  }
  
  const extractText = (children: unknown[]): string => {
    return children.map((child: unknown) => {
      if (isTextNode(child)) {
        return child.text
      }
      if (hasChildren(child)) {
        return extractText(child.children)
      }
      return ''
    }).join('')
  }
  
  return description.root.children.map((paragraph: unknown) => {
    if (hasChildren(paragraph)) {
      return extractText(paragraph.children)
    }
    return ''
  }).filter(Boolean).join('\n\n')
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  // Fetch all opportunities and find by slug
  const opportunities = await getOpportunities()
  const opportunity = opportunities.find(opp => generateSlug(opp.title) === slug)

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Opportunity Not Found</h1>
          <p className="text-slate-600 mb-8">The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d3f6b] transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(opportunity.deadline)
  const displayCategory = mapCategoryForDisplay(opportunity.category)
  const categoryColorClass = getCategoryColor(displayCategory)
  const organizationName = getOrganizationName(opportunity)
  const descriptionText = extractTextFromRichText(opportunity.description)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0F4C81] hover:text-[#0d3f6b] font-medium transition-colors">
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
              {opportunity.isVerified && (
                <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 size={14} />
                  Verified
                </div>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-4">
              {opportunity.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-slate-400" />
                <span className="font-medium">{organizationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-slate-400" />
                <span>Kenya</span>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-8 bg-slate-50 border-b border-[#E2E8F0]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Deadline</p>
                <p className={`font-semibold ${daysRemaining <= 7 ? 'text-[#F5A623]' : 'text-slate-900'}`}>
                  {formatDate(opportunity.deadline)}
                </p>
                <p className={`text-sm ${daysRemaining <= 7 ? 'text-[#F5A623]' : 'text-slate-500'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Accepted Documents</p>
                <div className="flex flex-wrap gap-1">
                  {opportunity.documentation.map((doc) => (
                    <span 
                      key={doc}
                      className="bg-white text-[#0F4C81] border border-[#0F4C81]/20 px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {doc.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Posted</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(opportunity.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">About this opportunity</h2>
            <div className="prose prose-slate max-w-none">
              {descriptionText.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 mb-4 last:mb-0 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 border-t border-[#E2E8F0] bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#0F4C81] hover:bg-[#0d3f6b] text-white px-6 py-4 rounded-xl font-bold text-base transition-colors"
              >
                Apply Now <ExternalLink size={18} />
              </a>
              <button 
                className="flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-xl font-bold text-base transition-colors"
                aria-label="Share opportunity"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
