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
import { Briefcase, GraduationCap, Building, BookOpen, ArrowRight, LucideIcon } from 'lucide-react'

type CategoryCounts = {
  jobs: number
  scholarships: number
  internships: number
  fellowships: number
  training?: number
  partners?: number
}

type CategoriesSectionProps = {
  counts: CategoryCounts
}

export const CategoriesSection = ({ counts }: CategoriesSectionProps) => {
  const categories: Array<{
    id: string
    href: string
    icon: LucideIcon
    title: string
    description: string
    count: number
    iconColor: string
    hoverBg: string
    ariaLabel: string
  }> = [
    {
      id: 'job',
      href: '/categories/jobs',
      icon: Briefcase,
      title: 'Jobs',
      description: 'Full-time and part-time employment opportunities',
      count: counts.jobs ?? 0,
      iconColor: 'bg-[#F5D300] text-white',
      hoverBg: 'hover:bg-yellow-400',
      ariaLabel: `Browse ${counts.jobs ?? 0} job opportunities`
    },
    {
      id: 'scholarship',
      href: '/categories/scholarships',
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Educational funding and grants',
      count: counts.scholarships ?? 0,
      iconColor: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white',
      hoverBg: 'hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500',
      ariaLabel: `Browse ${counts.scholarships ?? 0} scholarship opportunities`
    },
    {
      id: 'internship',
      href: '/categories/internships',
      icon: Building,
      title: 'Internships',
      description: 'Hands-on learning experiences',
      count: counts.internships ?? 0,
      iconColor: 'bg-gradient-to-br from-[#2D8FDD] to-cyan-500 text-white',
      hoverBg: 'hover:bg-gradient-to-r hover:from-[#2D8FDD] hover:to-cyan-500',
      ariaLabel: `Browse ${counts.internships ?? 0} internship opportunities`
    },
    {
      id: 'fellowship',
      href: '/categories/fellowships',
      icon: BookOpen,
      title: 'Fellowships',
      description: 'Professional development programs',
      count: counts.fellowships ?? 0,
      iconColor: 'bg-emerald-500 text-white',
      hoverBg: 'hover:bg-emerald-500',
      ariaLabel: `Browse ${counts.fellowships ?? 0} fellowship opportunities`
    },
    {
      id: 'training',
      href: '/categories/training',
      icon: BookOpen,
      title: 'Training',
      description: 'Skills development and certification programs',
      count: counts.training ?? 0,
      iconColor: 'bg-slate-500 text-white',
      hoverBg: 'hover:bg-slate-500',
      ariaLabel: `Browse ${counts.training ?? 0} training opportunities`
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
        <ul 
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          aria-label="Opportunity categories"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <li key={cat.title}>
                <Link
                  href={cat.href}
                  className={`group rounded-2xl border border-[#CFD8E3] bg-white p-6 transition-all duration-300 hover:shadow-xl ${cat.hoverBg} focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:ring-offset-2`}
                  aria-label={cat.ariaLabel}
                >
                {/* Category Icon */}
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${cat.iconColor} transition-transform duration-300 group-hover:scale-105`}
                  aria-hidden="true"
                >
                  <Icon size={24} />
                </div>
                
                {/* Category Title */}
                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight group-hover:text-white transition-colors">
                  {cat.title}
                </h3>
                
                <p className="text-lg text-slate-700 mb-5 max-w-md group-hover:text-white/90 transition-colors">
                  {cat.description}
                </p>
                
                {/* Count and Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-extrabold text-[#2D8FDD] group-hover:text-white transition-colors">
                    {cat.count}
                  </span>
                  <ArrowRight 
                    size={24} 
                    className="text-slate-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-1" 
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
