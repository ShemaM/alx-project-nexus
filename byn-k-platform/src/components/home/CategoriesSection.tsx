/**
 * Categories Section Component
 * 
 * Displays browsable category cards for different opportunity types.
 * Each card shows the count and links to filtered opportunity listings.
 * 
 * Features:
 * - Responsive grid layout
 * - Hover animations
 * - Live count display
 * - Tour integration via data-tour attribute
 * - WCAG accessibility compliant with ARIA labels
 * 
 * @module components/home/CategoriesSection
 */
import React from 'react'
import Link from 'next/link'
import { Briefcase, GraduationCap, Building, BookOpen, ArrowRight } from 'lucide-react'

type CategoryCounts = {
  jobs: number
  scholarships: number
  internships: number
  fellowships: number
  partners?: number
}

type CategoriesSectionProps = {
  counts: CategoryCounts
}

export const CategoriesSection = ({ counts }: CategoriesSectionProps) => {
  const categories = [
    {
      href: '/categories/jobs',
      icon: Briefcase,
      title: 'Jobs',
      description: 'Find verified job opportunities for your skills',
      count: counts.jobs ?? 0,
      color: 'bg-yellow-50 text-[#F5D300] border-yellow-200',
      ariaLabel: `Browse ${counts.jobs ?? 0} job opportunities`
    },
    {
      href: '/categories/scholarships',
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Educational funding opportunities for students',
      count: counts.scholarships ?? 0,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      ariaLabel: `Browse ${counts.scholarships ?? 0} scholarship opportunities`
    },
    {
      href: '/categories/internships',
      icon: Building,
      title: 'Internships',
      description: 'Gain experience with internship programs',
      count: counts.internships ?? 0,
      color: 'bg-blue-50 text-[#2D8FDD] border-blue-200',
      ariaLabel: `Browse ${counts.internships ?? 0} internship opportunities`
    },
    {
      href: '/categories/fellowships',
      icon: BookOpen,
      title: 'Fellowships',
      description: 'Fellowship programs and opportunities',
      count: counts.fellowships ?? 0,
      color: 'bg-green-50 text-green-600 border-green-200',
      ariaLabel: `Browse ${counts.fellowships ?? 0} fellowship opportunities`
    }
  ];
  
  return (
    <section 
      data-tour="categories" 
      className="py-12 bg-white"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 
            id="categories-heading"
            className="text-2xl md:text-3xl font-bold text-[#2D8FDD] mb-3"
          >
            Browse by Category
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Explore opportunities that match your goals and documentation status
          </p>
        </div>
        
        {/* Category Cards Grid */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          role="list"
          aria-label="Opportunity categories"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-lg hover:border-[#2D8FDD]/20 transition-all hover-lift focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:ring-offset-2"
                role="listitem"
                aria-label={cat.ariaLabel}
              >
                {/* Category Icon */}
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} border transition-transform group-hover:scale-110`}
                  aria-hidden="true"
                >
                  <Icon size={24} />
                </div>
                
                {/* Category Title */}
                <h3 className="text-lg font-bold text-[#2D8FDD] mb-1 group-hover:text-[#1E6BB8]">
                  {cat.title}
                </h3>
                
                {/* Description (hidden on mobile) */}
                <p className="text-sm text-slate-500 mb-3 hidden md:block">
                  {cat.description}
                </p>
                
                {/* Count and Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5D300]">
                    {cat.count} listings
                  </span>
                  <ArrowRight 
                    size={16} 
                    className="text-[#2D8FDD] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}