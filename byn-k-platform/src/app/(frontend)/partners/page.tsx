import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, Globe, CheckCircle2, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Our Partners | BYN-K Opportunity Platform',
  description: 'Meet our trusted partner organizations helping to connect refugee youth with verified opportunities.',
}

// Partner organizations that support refugees
const partners = [
  {
    id: '1',
    name: 'IKEA',
    description: 'IKEA Foundation supports refugees through programs that provide skills training, employment opportunities, and sustainable livelihoods for displaced communities.',
    website: 'https://www.ikeafoundation.org/',
    opportunitiesCount: 8,
    isVerified: true,
    category: 'Foundation',
    logo: '/images/partners/ikea.png'
  },
  {
    id: '2',
    name: 'Refugee Point',
    description: 'RefugePoint works to find lasting solutions for the world\'s most vulnerable refugees, providing protection, assistance, and pathways to self-reliance.',
    website: 'https://www.refugepoint.org/',
    opportunitiesCount: 6,
    isVerified: true,
    category: 'NGO',
    logo: '/images/partners/refugee-point.png'
  },
  {
    id: '3',
    name: 'Refugee Consortium of Kenya',
    description: 'RCK provides legal aid, advocacy, and psychosocial support to refugees and asylum seekers in Kenya, promoting their rights and well-being.',
    website: 'https://www.rckkenya.org/',
    opportunitiesCount: 10,
    isVerified: true,
    category: 'NGO',
    logo: '/images/partners/rck.png'
  },
  {
    id: '4',
    name: 'Cohere NGO',
    description: 'Cohere partners with refugee-led organizations to provide them with the resources, networks, and support needed to create lasting change in their communities.',
    website: 'https://www.wearecohere.org/',
    opportunitiesCount: 7,
    isVerified: true,
    category: 'NGO',
    logo: '/images/partners/cohere.png'
  },
  {
    id: '5',
    name: 'Amahoro Coalition',
    description: 'Amahoro Coalition brings together refugee-led organizations to amplify refugee voices and advocate for policies that support displaced communities.',
    website: 'https://www.amahorocoalition.org/',
    opportunitiesCount: 5,
    isVerified: true,
    category: 'Coalition',
    logo: '/images/partners/amahoro-coalition.png'
  },
  {
    id: '6',
    name: 'Inkomoko',
    description: 'Inkomoko provides business consulting, access to finance, and market linkages to help refugees and vulnerable populations build sustainable businesses.',
    website: 'https://www.inkomoko.com/',
    opportunitiesCount: 12,
    isVerified: true,
    category: 'Social Enterprise',
    logo: '/images/partners/inkomoko.png'
  }
]

const categories = ['All', 'Foundation', 'NGO', 'Coalition', 'Social Enterprise']

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
                  <div className="w-16 h-16 bg-[#0F4C81]/5 rounded-xl flex items-center justify-center overflow-hidden">
                    {partner.logo ? (
                      <Image 
                        src={partner.logo} 
                        alt={`${partner.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-[#0F4C81]" />
                    )}
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
