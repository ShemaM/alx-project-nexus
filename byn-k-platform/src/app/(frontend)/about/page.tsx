import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Target, Users, Shield, Heart, Globe, Award } from 'lucide-react'
import { getCategoryCounts } from '@/lib/api'

export const metadata = {
  title: 'About Us | BYN-K Opportunity Platform',
  description: 'Learn about BYN-K Opportunity Platform - connecting Banyamulenge refugee youth in Kenya with verified jobs, scholarships, and opportunities.',
}

const values = [
  {
    icon: Shield,
    title: 'Verified Opportunities',
    description: 'Every opportunity is manually verified by our team to ensure legitimacy and protect our community.'
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Built by the community, for the community. We understand the unique challenges faced by refugee youth.'
  },
  {
    icon: Globe,
    title: 'Documentation Flexibility',
    description: 'We filter opportunities based on accepted documentation, making it easy to find relevant opportunities.'
  },
  {
    icon: Award,
    title: 'Equal Access',
    description: 'Everyone deserves access to opportunities regardless of their documentation status.'
  }
]

export default async function AboutPage() {
  const counts = await getCategoryCounts()
  const totalOpportunities =
    (counts.jobs || 0) +
    (counts.scholarships || 0) +
    (counts.internships || 0) +
    (counts.fellowships || 0) +
    (counts.training || 0)

  const stats = [
    { value: counts.jobs || 0, label: 'Jobs' },
    { value: counts.scholarships || 0, label: 'Scholarships' },
    { value: counts.partners || 0, label: 'Partner Organizations' },
    { value: totalOpportunities, label: 'Total Opportunities' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-linear-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Empowering Refugee Youth Through <span className="text-[#F5D300]">Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            BYN-K is a dedicated platform connecting Banyamulenge refugee youth in Kenya with verified jobs, scholarships, internships, and training opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F5D300]/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#F5D300]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D8FDD]">Our Mission</h2>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                To bridge the gap between talented refugee youth and meaningful opportunities by providing a trusted, accessible platform that filters opportunities based on documentation requirements.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We believe that documentation status should not be a barrier to accessing education and employment opportunities. Our platform is designed to help you find opportunities that match your documentation, saving time and reducing frustration.
              </p>
            </div>
            <div className="bg-linear-to-br from-[#2D8FDD]/5 to-[#F5D300]/5 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#2D8FDD]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2D8FDD]">Who We Serve</h2>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#F5D300] rounded-full mt-2 shrink-0"></span>
                  <span>Banyamulenge refugee youth living in Kenya</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#F5D300] rounded-full mt-2 shrink-0"></span>
                  <span>Holders of Alien Cards, CTDs, and Passports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#F5D300] rounded-full mt-2 shrink-0"></span>
                  <span>Job seekers, students, and career changers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#F5D300] rounded-full mt-2 shrink-0"></span>
                  <span>Organizations looking to hire diverse talent</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Making an Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-[#F5D300] mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-4">
              Our Values
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to serving the refugee community with integrity and compassion.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#2D8FDD]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#2D8FDD]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-rrom-[#2D8FDD] to-[#1E6BB8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse our verified listings and take the next step in your career or education journey.
          </p>
          <Link 
            href="/opportunities" 
            className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-4 rounded-xl font-bold text-lg transition-colors"
          >
            Explore Opportunities
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
