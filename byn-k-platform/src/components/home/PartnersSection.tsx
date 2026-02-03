import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, ArrowRight } from 'lucide-react'

// Define a minimal Partner interface based on Django API
export interface Partner {
  id: number
  name: string
  website?: string
  logo?: string // URL to the logo image
  is_featured?: boolean
}

// Partner with opportunity count type
export interface PartnerWithCount extends Partner {
  opportunitiesCount: number
}

interface PartnersSectionProps {
  partners: PartnerWithCount[]
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
  // If no partners provided, show placeholder
  if (!partners || partners.length === 0) {
    return (
      <section className="py-16 bg-slate-50 border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-3">
              Our Trusted Partners
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              We collaborate with leading organizations to bring you verified opportunities
            </p>
          </div>
          
          <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">
              Partner organizations will appear here once they are added.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-slate-50 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-3">
            Our Trusted Partners
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            We collaborate with leading organizations to bring you verified opportunities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.slice(0, 6).map((partner) => {
            return (
              <Link 
                key={partner.id}
                href={`/partners/${partner.id}`}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-lg transition-all duration-300 hover:border-[#2D8FDD]/20 group cursor-pointer block"
              >
                {/* Logo and Verified Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-20 h-20 bg-linear-to-br from-[#2D8FDD]/5 to-[#F5D300]/5 rounded-xl flex items-center justify-center overflow-hidden p-2">
                    {partner.logo ? (
                      <Image 
                        src={partner.logo} 
                        alt={`${partner.name} logo`}
                        width={64}
                        height={64}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <Building2 size={32} className="text-[#2D8FDD]" />
                    )}
                  </div>
                </div>

                {/* Partner Info */}
                <h3 className="text-lg font-bold text-[#2D8FDD] mb-1 group-hover:text-[#1E6BB8] transition-colors">
                  {partner.name}
                </h3>
                
                {/* Opportunities count */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <span className="text-sm text-slate-500">
                    <span className="font-bold text-[#F5D300]">{partner.opportunitiesCount}</span> opportunities
                  </span>
                  <span className="flex items-center gap-1 text-[#2D8FDD] text-xs font-semibold group-hover:text-[#1E6BB8] transition-colors">
                    View <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/partners"
            className="inline-flex items-center gap-2 bg-[#2D8FDD] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1E6BB8] transition-colors"
          >
            View All Partners <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
