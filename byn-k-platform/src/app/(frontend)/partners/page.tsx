import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react'
import { getPartnersWithOpportunityCounts } from '@/lib/payload'
import type { Media, Partner } from '@/payload-types'

export const metadata = {
  title: 'Our Partners | BYN-K Opportunity Platform',
  description: 'Meet our trusted partner organizations helping to connect refugee youth with verified opportunities.',
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper to get logo URL from partner
const getLogoUrl = (logo: number | Media | null | undefined): string | null => {
  if (!logo) return null
  if (typeof logo === 'number') return null
  return (logo as Media).url || null
}

// Map partner type to display label
const getPartnerTypeLabel = (type: Partner['type']): string => {
  const typeLabels: Record<string, string> = {
    company: 'Company',
    ngo: 'NGO',
    education: 'Educational Institution',
    government: 'Government',
    other: 'Organization',
  }
  return typeLabels[type] || 'Organization'
}

export default async function PartnersPage() {
  // Fetch partners with their opportunity counts from Payload CMS
  const partners = await getPartnersWithOpportunityCounts()
  
  // Calculate total opportunities
  const totalOpportunities = partners.reduce((acc, p) => acc + p.opportunitiesCount, 0)
  
  // Get unique partner types for stats
  const uniqueTypes = new Set(partners.map(p => p.type))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#F5D300]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Our Trusted Partners
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            We collaborate with leading organizations to bring you verified opportunities. Our partners are committed to supporting refugee youth.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-[#2D8FDD]">{partners.length}</div>
              <div className="text-slate-600 text-sm">Partner Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D8FDD]">
                {totalOpportunities}
              </div>
              <div className="text-slate-600 text-sm">Active Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D8FDD]">100%</div>
              <div className="text-slate-600 text-sm">Verified Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2D8FDD]">{uniqueTypes.size}</div>
              <div className="text-slate-600 text-sm">Sectors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {partners.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => {
                const logoUrl = getLogoUrl(partner.logo)
                
                return (
                  <Link
                    key={partner.id}
                    href={`/partners/${partner.id}`}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-8 hover:shadow-xl transition-all duration-300 hover:border-[#2D8FDD]/20 group cursor-pointer block"
                  >
                    {/* Header with larger logo */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#2D8FDD]/5 to-[#F5D300]/5 rounded-2xl flex items-center justify-center overflow-hidden p-3">
                        {logoUrl ? (
                          <Image 
                            src={logoUrl} 
                            alt={`${partner.name} logo`}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <Building2 className="w-10 h-10 text-[#2D8FDD]" />
                        )}
                      </div>
                      {partner.isActive && (
                        <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-3 py-1.5 rounded-full text-sm font-semibold">
                          <CheckCircle2 size={14} />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-bold text-[#2D8FDD] mb-2 group-hover:text-[#1E6BB8] transition-colors">
                      {partner.name}
                    </h3>
                    <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-medium mb-4">
                      {getPartnerTypeLabel(partner.type)}
                    </span>
                    {partner.description && (
                      <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                        {partner.description}
                      </p>
                    )}

                    {/* Stats & CTA */}
                    <div className="flex items-center justify-between pt-5 border-t border-[#E2E8F0]">
                      <span className="text-sm text-slate-500">
                        <span className="font-bold text-[#F5D300] text-lg">{partner.opportunitiesCount}</span> opportunities
                      </span>
                      <span className="flex items-center gap-1.5 text-[#2D8FDD] text-sm font-semibold group-hover:text-[#1E6BB8] transition-colors">
                        View All
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Partners Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Partner organizations will be displayed here once they are added to the platform.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Become a Partner
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of trusted organizations and help connect refugee youth with meaningful opportunities. Together, we can make a difference.
          </p>
          <a 
            href="mailto:partners@byn-k.org" 
            className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
