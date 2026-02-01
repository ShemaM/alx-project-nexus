import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { getPartnerById, getOpportunitiesByPartner, getOrganizationName, mapCategoryForDisplay } from '@/lib/payload'
import { generateSlug } from '@/types'
import { Building2, Globe, ExternalLink, CheckCircle2, ArrowLeft, Briefcase } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { Media, Opportunity } from '@/payload-types'
import type { TransformedOpportunity } from '@/components/home/HomeContent'

export const dynamic = 'force-dynamic'

// Helper to get logo URL
const getLogoUrl = (logo: number | Media | null | undefined): string | null => {
  if (!logo) return null
  if (typeof logo === 'number') return null
  return (logo as Media).url || null
}

// Helper to get document URL
const getDocumentUrl = (doc: Opportunity['opportunityDocument']): string | null => {
  if (!doc) return null
  if (typeof doc === 'number') return null
  return (doc as Media).url || null
}

// Transform Payload opportunity to client-safe format
const transformOpportunity = (opp: Opportunity): TransformedOpportunity => ({
  id: String(opp.id),
  slug: generateSlug(opp.title),
  title: opp.title,
  organizationName: getOrganizationName(opp),
  category: mapCategoryForDisplay(opp.category) as TransformedOpportunity['category'],
  documentation: opp.documentation || [],
  deadline: opp.deadline,
  isVerified: opp.isVerified ?? false,
  location: opp.location || null,
  applicationType: opp.applicationType || 'link',
  applyLink: opp.applyLink,
  applicationEmail: opp.applicationEmail,
  emailSubjectLine: opp.emailSubjectLine,
  requiredDocuments: opp.requiredDocuments,
  descriptionType: opp.descriptionType || 'text',
  opportunityDocumentUrl: getDocumentUrl(opp.opportunityDocument),
  createdAt: opp.createdAt,
})

// Map partner type to display label
const getPartnerTypeLabel = (type: string): string => {
  const typeLabels: Record<string, string> = {
    company: 'Company',
    ngo: 'NGO',
    education: 'Educational Institution',
    government: 'Government',
    other: 'Organization',
  }
  return typeLabels[type] || 'Organization'
}

interface PartnerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PartnerPageProps) {
  const { id } = await params
  const partnerId = parseInt(id, 10)
  
  if (isNaN(partnerId)) {
    return { title: 'Partner Not Found | BYN-K' }
  }

  const partner = await getPartnerById(partnerId)
  
  if (!partner) {
    return { title: 'Partner Not Found | BYN-K' }
  }

  return {
    title: `${partner.name} Opportunities | BYN-K`,
    description: partner.description || `View opportunities from ${partner.name} on BYN-K Platform`,
  }
}

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  const { id } = await params
  const partnerId = parseInt(id, 10)
  
  if (isNaN(partnerId)) {
    notFound()
  }

  // Fetch partner and their opportunities
  const [partner, opportunities] = await Promise.all([
    getPartnerById(partnerId),
    getOpportunitiesByPartner(partnerId),
  ])

  if (!partner) {
    notFound()
  }

  const logoUrl = getLogoUrl(partner.logo)
  const transformedOpportunities = opportunities.map(transformOpportunity)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Link */}
          <Link 
            href="/partners" 
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Partners
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Partner Logo */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3 shadow-lg">
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={`${partner.name} logo`}
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Building2 className="w-12 h-12 text-[#2D8FDD]" />
              )}
            </div>

            {/* Partner Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                  {partner.name}
                </h1>
                {partner.isActive && (
                  <div className="flex items-center gap-1 bg-emerald-400/20 text-emerald-100 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <CheckCircle2 size={14} />
                    Verified
                  </div>
                )}
              </div>
              <span className="inline-block bg-white/10 text-blue-100 px-3 py-1 rounded-lg text-sm font-medium mb-3">
                {getPartnerTypeLabel(partner.type)}
              </span>
              {partner.description && (
                <p className="text-blue-100 text-lg max-w-2xl">
                  {partner.description}
                </p>
              )}
              {partner.website && (
                <a 
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#F5D300] hover:text-yellow-300 mt-4 font-semibold transition-colors"
                >
                  <Globe size={16} />
                  Visit Website
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#2D8FDD]/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#2D8FDD]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2D8FDD]">{opportunities.length}</div>
                <div className="text-slate-500 text-sm">Active Opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Opportunities from {partner.name}
          </h2>

          {transformedOpportunities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  id={opp.id}
                  slug={opp.slug}
                  title={opp.title}
                  organizationName={opp.organizationName}
                  category={opp.category}
                  documentation={opp.documentation}
                  deadline={opp.deadline}
                  isVerified={opp.isVerified}
                  applicationType={opp.applicationType}
                  applyLink={opp.applyLink}
                  applicationEmail={opp.applicationEmail}
                  emailSubjectLine={opp.emailSubjectLine}
                  requiredDocuments={opp.requiredDocuments}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Opportunities Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {partner.name} hasn&apos;t posted any active opportunities yet. Check back later for new listings.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
