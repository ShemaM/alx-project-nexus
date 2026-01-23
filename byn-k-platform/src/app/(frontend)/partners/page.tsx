import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, Globe, CheckCircle2, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Our Partners | BYN-K Opportunity Platform',
  description: 'Meet our trusted partner organizations helping to connect refugee youth with verified opportunities.',
}

// Sample partners data (would come from Payload CMS)
const partners = [
  {
    id: '1',
    name: 'UNHCR Kenya',
    description: 'The UN Refugee Agency works to ensure that everyone has the right to seek asylum and find safe refuge in another state.',
    website: 'https://www.unhcr.org/ke/',
    opportunitiesCount: 12,
    isVerified: true,
    category: 'UN Agency'
  },
  {
    id: '2',
    name: 'ALX Africa',
    description: 'ALX is a leadership development program that provides young Africans with the skills needed for the digital economy.',
    website: 'https://www.alxafrica.com/',
    opportunitiesCount: 5,
    isVerified: true,
    category: 'Education'
  },
  {
    id: '3',
    name: 'Mastercard Foundation',
    description: 'The Foundation works with partners to provide greater access to education, skills training, and financial services.',
    website: 'https://mastercardfdn.org/',
    opportunitiesCount: 8,
    isVerified: true,
    category: 'Foundation'
  },
  {
    id: '4',
    name: 'Kenya Red Cross',
    description: 'Kenya Red Cross Society provides humanitarian services to the most vulnerable communities in Kenya.',
    website: 'https://www.redcross.or.ke/',
    opportunitiesCount: 6,
    isVerified: true,
    category: 'Humanitarian'
  },
  {
    id: '5',
    name: 'Tech Solutions Kenya',
    description: 'A leading technology company providing employment opportunities for skilled developers and tech professionals.',
    website: '#',
    opportunitiesCount: 3,
    isVerified: true,
    category: 'Private Sector'
  },
  {
    id: '6',
    name: 'World Bank Kenya',
    description: 'The World Bank Group works with the Government of Kenya to reduce poverty and enhance shared prosperity.',
    website: 'https://www.worldbank.org/en/country/kenya',
    opportunitiesCount: 4,
    isVerified: true,
    category: 'International Organization'
  },
  {
    id: '7',
    name: 'Safaricom',
    description: 'Kenya\'s leading telecommunications company, committed to transforming lives through technology and innovation.',
    website: 'https://www.safaricom.co.ke/',
    opportunitiesCount: 7,
    isVerified: true,
    category: 'Private Sector'
  },
  {
    id: '8',
    name: 'Microsoft',
    description: 'Global technology company offering digital skills training and opportunities for young professionals.',
    website: 'https://www.microsoft.com/',
    opportunitiesCount: 2,
    isVerified: true,
    category: 'Private Sector'
  }
]

const categories = ['All', 'UN Agency', 'Foundation', 'Education', 'Humanitarian', 'Private Sector', 'International Organization']

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#0F4C81] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#F5A623]" />
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
              <div className="text-3xl font-bold text-[#0F4C81]">{partners.length}</div>
              <div className="text-slate-600 text-sm">Partner Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0F4C81]">
                {partners.reduce((acc, p) => acc + p.opportunitiesCount, 0)}
              </div>
              <div className="text-slate-600 text-sm">Active Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0F4C81]">100%</div>
              <div className="text-slate-600 text-sm">Verified Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0F4C81]">{categories.length - 1}</div>
              <div className="text-slate-600 text-sm">Sectors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-[#0F4C81]/5 rounded-xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-[#0F4C81]" />
                  </div>
                  {partner.isVerified && (
                    <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-2 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle2 size={12} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-[#0F4C81] mb-2">
                  {partner.name}
                </h3>
                <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium mb-3">
                  {partner.category}
                </span>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {partner.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                  <span className="text-sm text-slate-500">
                    <span className="font-semibold text-[#F5A623]">{partner.opportunitiesCount}</span> opportunities
                  </span>
                  {partner.website !== '#' && (
                    <Link 
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#0F4C81] text-sm font-medium hover:underline"
                    >
                      <Globe size={14} />
                      Website
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-gradient-to-r from-[#0F4C81] to-[#1a5a9a]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Become a Partner
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of trusted organizations and help connect refugee youth with meaningful opportunities. Together, we can make a difference.
          </p>
          <a 
            href="mailto:partners@byn-k.org" 
            className="inline-block bg-[#F5A623] hover:bg-[#d98c1d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
