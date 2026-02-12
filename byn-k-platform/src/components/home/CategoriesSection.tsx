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
    accentColor: string
    accentBg: string
    hoverBorder: string
    ariaLabel: string
  }> = [
    {
      id: 'job',
      href: '/categories/jobs',
      icon: Briefcase,
      title: 'Jobs',
      description: 'Full-time and part-time employment opportunities',
      count: counts.jobs ?? 0,
      iconColor: 'bg-amber-100 text-amber-700',
      accentColor: 'text-amber-700',
      accentBg: 'bg-amber-50',
      hoverBorder: 'hover:border-amber-200',
      ariaLabel: `Browse ${counts.jobs ?? 0} job opportunities`
    },
    {
      id: 'scholarship',
      href: '/categories/scholarships',
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Educational funding and grants',
      count: counts.scholarships ?? 0,
      iconColor: 'bg-violet-100 text-violet-700',
      accentColor: 'text-violet-700',
      accentBg: 'bg-violet-50',
      hoverBorder: 'hover:border-violet-200',
      ariaLabel: `Browse ${counts.scholarships ?? 0} scholarship opportunities`
    },
    {
      id: 'internship',
      href: '/categories/internships',
      icon: Building,
      title: 'Internships',
      description: 'Hands-on learning experiences',
      count: counts.internships ?? 0,
      iconColor: 'bg-sky-100 text-sky-700',
      accentColor: 'text-sky-700',
      accentBg: 'bg-sky-50',
      hoverBorder: 'hover:border-sky-200',
      ariaLabel: `Browse ${counts.internships ?? 0} internship opportunities`
    },
    {
      id: 'fellowship',
      href: '/categories/fellowships',
      icon: BookOpen,
      title: 'Fellowships',
      description: 'Professional development programs',
      count: counts.fellowships ?? 0,
      iconColor: 'bg-emerald-100 text-emerald-700',
      accentColor: 'text-emerald-700',
      accentBg: 'bg-emerald-50',
      hoverBorder: 'hover:border-emerald-200',
      ariaLabel: `Browse ${counts.fellowships ?? 0} fellowship opportunities`
    },
    {
      id: 'training',
      href: '/categories/training',
      icon: BookOpen,
      title: 'Training',
      description: 'Skills development and certification programs',
      count: counts.training ?? 0,
      iconColor: 'bg-slate-100 text-slate-700',
      accentColor: 'text-slate-700',
      accentBg: 'bg-slate-100',
      hoverBorder: 'hover:border-slate-300',
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Opportunity categories"
        >
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <li key={cat.title}>
                <Link
                  href={cat.href}
                  className={`group block h-full rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cat.hoverBorder} focus:outline-none focus:ring-2 focus:ring-[#2D8FDD] focus:ring-offset-2`}
                  aria-label={cat.ariaLabel}
                >
                {/* Category Icon */}
                <div 
                  className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${cat.iconColor}`}
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </div>
                
                {/* Category Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-1.5 leading-tight">
                  {cat.title}
                </h3>
                
                <p className="text-sm text-slate-600 mb-4 max-w-sm">
                  {cat.description}
                </p>
                
                {/* Count and Arrow */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-semibold ${cat.accentBg} ${cat.accentColor}`}>
                    {cat.count} open
                  </span>
                  <ArrowRight 
                    size={18} 
                    className={`text-slate-400 transition-all duration-200 group-hover:translate-x-1 ${cat.accentColor}`} 
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
