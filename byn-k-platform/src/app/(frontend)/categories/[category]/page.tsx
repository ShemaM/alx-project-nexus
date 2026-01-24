'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { SearchBar } from '@/components/home/SearchBar'
import { ArrowLeft, Briefcase, GraduationCap, Building, BookOpen } from 'lucide-react'

// Category metadata
const categoryMeta: Record<string, { title: string; description: string; icon: React.ElementType; color: string }> = {
  jobs: {
    title: 'Jobs',
    description: 'Find verified job opportunities suitable for your documentation status',
    icon: Briefcase,
    color: 'bg-orange-50 text-[#F5A623]'
  },
  scholarships: {
    title: 'Scholarships',
    description: 'Discover scholarship programs for refugees and displaced youth',
    icon: GraduationCap,
    color: 'bg-purple-50 text-purple-600'
  },
  internships: {
    title: 'Internships',
    description: 'Gain valuable work experience through internship programs',
    icon: Building,
    color: 'bg-blue-50 text-blue-600'
  },
  training: {
    title: 'Training Programs',
    description: 'Build new skills with professional training and bootcamps',
    icon: BookOpen,
    color: 'bg-green-50 text-green-600'
  }
}

// Sample opportunities (would be fetched from Payload CMS)
const allOpportunities = [
  {
    id: '1',
    title: 'Junior Software Developer',
    organizationName: 'Tech Solutions Kenya',
    category: 'job' as const,
    categorySlug: 'jobs',
    documentation: ['alien_card', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/1'
  },
  {
    id: '5',
    title: 'Customer Service Representative',
    organizationName: 'Safaricom',
    category: 'job' as const,
    categorySlug: 'jobs',
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/5'
  },
  {
    id: '6',
    title: 'Data Entry Clerk',
    organizationName: 'Kenya Red Cross',
    category: 'job' as const,
    categorySlug: 'jobs',
    documentation: ['alien_card'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/6'
  },
  {
    id: '2',
    title: 'DAFI Scholarship 2025',
    organizationName: 'UNHCR',
    category: 'scholarship' as const,
    categorySlug: 'scholarships',
    documentation: ['alien_card', 'ctd'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/2'
  },
  {
    id: '7',
    title: 'Mastercard Foundation Scholars',
    organizationName: 'Mastercard Foundation',
    category: 'scholarship' as const,
    categorySlug: 'scholarships',
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/7'
  },
  {
    id: '3',
    title: 'Digital Marketing Internship',
    organizationName: 'Growth Agency',
    category: 'internship' as const,
    categorySlug: 'internships',
    documentation: ['passport', 'alien_card'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: false,
    applyLink: '/opportunities/3'
  },
  {
    id: '8',
    title: 'Finance Intern',
    organizationName: 'World Bank Kenya',
    category: 'internship' as const,
    categorySlug: 'internships',
    documentation: ['passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/8'
  },
  {
    id: '4',
    title: 'Coding Bootcamp Training',
    organizationName: 'ALX Africa',
    category: 'training' as const,
    categorySlug: 'training',
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/4'
  },
  {
    id: '9',
    title: 'Digital Skills Training',
    organizationName: 'Microsoft',
    category: 'training' as const,
    categorySlug: 'training',
    documentation: ['alien_card', 'ctd', 'passport'] as ('alien_card' | 'ctd' | 'passport')[],
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    isVerified: true,
    applyLink: '/opportunities/9'
  }
]

interface PageProps {
  params: Promise<{ category: string }>
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params)
  const [searchQuery, setSearchQuery] = useState('')
  
  const meta = categoryMeta[category]
  
  if (!meta) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h1>
          <p className="text-slate-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d3f6b] transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const Icon = meta.icon
  
  // Filter opportunities by category
  const categoryOpportunities = allOpportunities.filter(opp => opp.categorySlug === category)
  
  // Apply search filter
  const filteredOpportunities = categoryOpportunities.filter(opp => {
    if (searchQuery && !opp.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Category Header */}
      <section className="bg-[#0F4C81] py-12 md:py-16">
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
            <span className="text-[#F5A623] font-bold text-lg">
              {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} available
            </span>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <SearchBar onSearch={setSearchQuery} />
      </section>

      {/* Opportunities List */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col gap-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                id={opp.id}
                title={opp.title}
                organizationName={opp.organizationName}
                category={opp.category}
                documentation={opp.documentation}
                deadline={opp.deadline}
                isVerified={opp.isVerified}
                applyLink={opp.applyLink}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-[#E2E8F0]">
              <p className="text-lg">No {meta.title.toLowerCase()} found</p>
              <p className="text-sm mt-2">Try adjusting your search or check back later for new listings</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
