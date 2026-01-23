import React from 'react'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

// Sample partners (would come from Payload CMS)
const featuredPartners = [
  { id: '1', name: 'UNHCR Kenya' },
  { id: '2', name: 'ALX Africa' },
  { id: '3', name: 'Mastercard Foundation' },
  { id: '4', name: 'Kenya Red Cross' },
  { id: '5', name: 'Safaricom' },
  { id: '6', name: 'World Bank Kenya' },
]

export const PartnersSection = () => {
  return (
    <section className="py-12 bg-slate-50 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-3">
            Our Trusted Partners
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            We collaborate with leading organizations to bring you verified opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredPartners.map((partner) => (
            <div 
              key={partner.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#0F4C81]/5 rounded-full flex items-center justify-center mb-3">
                <Building2 size={20} className="text-[#0F4C81]" />
              </div>
              <span className="text-sm font-semibold text-slate-700 line-clamp-2">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/partners"
            className="inline-flex items-center gap-2 text-[#0F4C81] font-semibold hover:text-[#0d3f6b] transition-colors"
          >
            View All Partners <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
