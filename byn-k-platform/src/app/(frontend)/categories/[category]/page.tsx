import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Briefcase, GraduationCap, Building, Award } from 'lucide-react'
import { generateSlug } from '@/types'
import type { Opportunity, Media } from '@/payload-types'

// Force dynamic rendering to fetch data at runtime
export const dynamic = 'force-dynamic'

// Category metadata
const categoryMeta: Record<string, { title: string; description: string; icon: React.ElementType; color: string; dbCategory: string }> = {
  jobs: {
    title: 'Jobs',
    description: 'Find verified job opportunities suitable for your documentation status',
    icon: Briefcase,
    color: 'bg-yellow-50 text-[#F5D300]',
    dbCategory: 'jobs'
  },
  scholarships: {
    title: 'Scholarships',
    description: 'Discover scholarship programs for refugees and displaced youth',
    icon: GraduationCap,
    color: 'bg-purple-50 text-purple-600',
    dbCategory: 'scholarships'
  },
  internships: {
    title: 'Internships',
    description: 'Gain valuable work experience through internship programs',
    icon: Building,
    color: 'bg-blue-50 text-[#2D8FDD]',
    dbCategory: 'internships'
  },
  fellowships: {
    title: 'Fellowships',
    description: 'Access fellowship opportunities for professional development',
    icon: Award,
    color: 'bg-green-50 text-green-600',
    dbCategory: 'fellowships'
  }
}



interface PageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  
  const meta = categoryMeta[category]
  
  if (!meta) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#2D8FDD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1E6BB8] transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Fetch real opportunities from Payload CMS
  const transformedOpportunities = [];

  const Icon = meta.icon

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Category Header */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} />
            Back to All Opportunities
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${meta.color}`}>
              <Icon size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              {meta.title}
            </h1>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl">
            {meta.description}
          </p>
          <div className="mt-6">
            <span className="text-[#F5D300] font-bold text-lg">
              {transformedOpportunities.length} {transformedOpportunities.length === 1 ? 'opportunity' : 'opportunities'} available
            </span>
          </div>
        </div>
      </section>

      {/* Opportunities List */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          {transformedOpportunities.length > 0 ? (
            transformedOpportunities.map((opp) => (
              <div key={opp.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold">{opp.title}</h2>
                <p className="text-gray-600">{opp.organizationName}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-lg">No {meta.title.toLowerCase()} found</p>
              <p className="text-sm mt-2">Check back later for new listings</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
