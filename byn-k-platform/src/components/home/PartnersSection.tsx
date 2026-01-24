import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react'

// Key partner organizations supporting refugees
const featuredPartners = [
  { 
    id: '1', 
    name: 'IKEA Foundation', 
    logo: '/images/partners/IKEA.png',
    description: 'Supporting refugee livelihoods and education',
    category: 'Foundation'
  },
  { 
    id: '2', 
    name: 'RefugePoint', 
    logo: '/images/partners/RefugeePoint.png',
    description: 'Finding lasting solutions for refugees',
    category: 'NGO'
  },
  { 
    id: '3', 
    name: 'Refugee Consortium of Kenya', 
    logo: '/images/partners/Refugee Consortium of Kenya.jpg',
    description: 'Legal aid and advocacy for refugees',
    category: 'NGO'
  },
  { 
    id: '4', 
    name: 'Cohere', 
    logo: '/images/partners/Cohere.png',
    description: 'Empowering refugee-led organizations',
    category: 'NGO'
  },
  { 
    id: '5', 
    name: 'Amahoro Coalition', 
    logo: '/images/partners/AmahoroCoalition.jpeg',
    description: 'Amplifying refugee voices globally',
    category: 'Coalition'
  },
  { 
    id: '6', 
    name: 'Inkomoko', 
    logo: '/images/partners/inkomoko.png',
    description: 'Business support for entrepreneurs',
    category: 'Social Enterprise'
  },
]

export const PartnersSection = () => {
  return (
    <section className="py-16 bg-slate-50 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-3">
            Our Trusted Partners
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            We collaborate with leading organizations to bring you verified opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPartners.map((partner) => (
            <div 
              key={partner.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-all duration-300 hover:border-[#0F4C81]/20"
            >
              {/* Logo and Verified Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0F4C81]/5 to-[#F5A623]/5 rounded-xl flex items-center justify-center overflow-hidden p-2">
                  {partner.logo ? (
                    <Image 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <Building2 size={32} className="text-[#0F4C81]" />
                  )}
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-2 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 size={12} />
                  Verified
                </div>
              </div>

              {/* Partner Info */}
              <h3 className="text-lg font-bold text-[#0F4C81] mb-1">
                {partner.name}
              </h3>
              <span className="inline-block bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium mb-3">
                {partner.category}
              </span>
              <p className="text-slate-600 text-sm">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/partners"
            className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d3f6b] transition-colors"
          >
            View All Partners <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
