import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Building2, Handshake, ArrowRight } from 'lucide-react';
import { getPartners, getCategoryCounts } from '@/lib/api';

export const metadata = {
  title: 'Our Partners | Opportunities for Banyamulenge Youth in Kenya',
  description: 'Meet our trusted partners working together to provide opportunities for Banyamulenge refugee youth in Kenya.',
}

// Use ISR with revalidation for better performance
export const revalidate = 60

// Partner logo URL validation (same as PartnersSection)
const ALLOWED_REMOTE_IMAGE_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'nexus-backend-lkps.onrender.com',
])

function getSafePartnerLogoSrc(logo?: string): string | null {
  if (!logo) return null

  // Local static/public or proxied media path
  if (logo.startsWith('/')) {
    return logo
  }

  try {
    const parsed = new URL(logo)
    const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:'
    if (!isHttp) return null

    // Reject Google Image Search result links (not direct image files)
    if (parsed.hostname.includes('google.') && parsed.pathname.startsWith('/imgres')) {
      return null
    }

    // Match next.config.mjs remote image allowlist
    if (!ALLOWED_REMOTE_IMAGE_HOSTS.has(parsed.hostname)) {
      return null
    }

    if (parsed.pathname.startsWith('/media/')) {
      return logo
    }

    return null
  } catch {
    return null
  }
}

export default async function PartnersPage() {
  // Fetch partners and category counts from Django API
  let partnersData: Array<{ id: number; name: string; website_url?: string; logo_url?: string; logo?: string; is_featured?: boolean; opportunity_count?: number; description?: string }> = []
  let categoryCounts = {
    jobs: 0,
    scholarships: 0,
    internships: 0,
    fellowships: 0,
    training: 0,
    partners: 0,
  }
  
  try {
    const [partnersResponse, countsResponse] = await Promise.all([
      getPartners(),
      getCategoryCounts(),
    ])
    partnersData = partnersResponse?.data || []
    categoryCounts = countsResponse || categoryCounts
  } catch (error) {
    console.error('Error fetching partners:', error)
  }

  // Map partners data to display format
  const partners = partnersData.map(p => ({
    id: p.id,
    name: p.name,
    website: p.website_url,
    logo: p.logo_url || p.logo,
    is_featured: p.is_featured,
    opportunitiesCount: p.opportunity_count || 0,
    description: p.description || '',
  }))

  // Calculate total opportunities
  const totalOpportunities =
    (categoryCounts.jobs || 0) +
    (categoryCounts.scholarships || 0) +
    (categoryCounts.internships || 0) +
    (categoryCounts.fellowships || 0) +
    (categoryCounts.training || 0)
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Handshake className="w-8 h-8 text-[#F5D300]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Our Partners
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            We are proud to collaborate with a diverse range of organizations dedicated to empowering Banyamulenge refugee youth in Kenya.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {partners.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">
                Partner organizations will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => {
                const safeLogoSrc = getSafePartnerLogoSrc(partner.logo);
                return (
                  <Link 
                    key={partner.id}
                    href={`/partners/${partner.id}`}
                    className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-[#2D8FDD]/30 group block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                        {safeLogoSrc ? (
                          <Image 
                            src={safeLogoSrc}
                            alt={`${partner.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <Building2 className="w-7 h-7 text-[#2D8FDD]" />
                        )}
                      </div>
                      <div className="flex-1">
                        {partner.is_featured && (
                          <span className="text-xs font-semibold text-[#F5D300] uppercase tracking-wider">
                            Featured Partner
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2 group-hover:text-[#2D8FDD] transition-colors">
                          {partner.name}
                        </h3>
                        {partner.description && (
                          <p className="text-slate-600 leading-relaxed text-sm mb-3">
                            {partner.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                          <span className="text-sm text-slate-500">
                            <span className="font-bold text-[#F5D300]">{partner.opportunitiesCount}</span> opportunities
                          </span>
                          <span className="flex items-center gap-1 text-[#2D8FDD] text-xs font-semibold group-hover:text-[#1E6BB8] transition-colors">
                            View <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Impact Section */}
      <section className="py-16 bg-gradient-to-br from-[#2D8FDD]/5 to-[#F5D300]/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-6">
            Together, We Create Impact
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Our partnerships enable us to verify opportunities, provide training resources, and ensure every listing reaches the youth who need it most. Through collaboration, we bridge the gap between talented refugee youth and meaningful opportunities.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#2D8FDD]">100%</div>
              <div className="text-sm text-slate-600 mt-1">Verified Listings</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#F5D300]">{partners.length || 0}</div>
              <div className="text-sm text-slate-600 mt-1">Key Partners</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#2D8FDD]">{totalOpportunities.toLocaleString()}</div>
              <div className="text-sm text-slate-600 mt-1">Opportunities</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#F5D300]">5+</div>
              <div className="text-sm text-slate-600 mt-1">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Become a Partner
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Are you an NGO, employer, or community organization? Partner with us to reach and empower Banyamulenge youth in Kenya.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
