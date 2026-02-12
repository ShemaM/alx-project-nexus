import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Building2, GraduationCap, Globe, Users, Handshake } from 'lucide-react';

export const metadata = {
  title: 'Our Partners | Opportunities for Banyamulenge Youth in Kenya',
  description: 'Meet our trusted partners working together to provide opportunities for Banyamulenge refugee youth in Kenya.',
}

const partners = [
  {
    icon: Globe,
    name: 'UNHCR Kenya',
    description: 'Collaborating on protection and resource navigation for displaced youth.',
    category: 'Protection & Resources',
  },
  {
    icon: GraduationCap,
    name: 'ALX Africa',
    description: 'Providing pathways to high-end tech training and digital skills.',
    category: 'Tech Training',
  },
  {
    icon: Building2,
    name: 'Windle International Kenya',
    description: 'Supporting our scholarship vertical for secondary and tertiary education.',
    category: 'Education & Scholarships',
  },
  {
    icon: Users,
    name: 'Banyamulenge Community Leaders (Kenya)',
    description: 'Ensuring our platform stays culturally relevant and reaches the youth who need it most.',
    category: 'Community Engagement',
  },
];

export default function PartnersPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partners.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <div 
                  key={index}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-[#2D8FDD]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-[#2D8FDD]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#F5D300] uppercase tracking-wider">
                        {partner.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1 mb-3">
                        {partner.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
              <div className="text-3xl font-bold text-[#F5D300]">4+</div>
              <div className="text-sm text-slate-600 mt-1">Key Partners</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-[#2D8FDD]">1000+</div>
              <div className="text-sm text-slate-600 mt-1">Youth Reached</div>
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
