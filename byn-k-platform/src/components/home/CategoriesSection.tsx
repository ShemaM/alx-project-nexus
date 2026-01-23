import React from 'react'
import Link from 'next/link'
import { Briefcase, GraduationCap, Building, BookOpen, ArrowRight } from 'lucide-react'

const categories = [
  {
    href: '/categories/jobs',
    icon: Briefcase,
    title: 'Jobs',
    description: 'Find verified job opportunities for your skills',
    count: '50+',
    color: 'bg-orange-50 text-[#F5A623] border-orange-200'
  },
  {
    href: '/categories/scholarships',
    icon: GraduationCap,
    title: 'Scholarships',
    description: 'Educational funding opportunities for students',
    count: '20+',
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  {
    href: '/categories/internships',
    icon: Building,
    title: 'Internships',
    description: 'Gain experience with internship programs',
    count: '30+',
    color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    href: '/categories/training',
    icon: BookOpen,
    title: 'Training',
    description: 'Skill-building courses and bootcamps',
    count: '15+',
    color: 'bg-green-50 text-green-600 border-green-200'
  }
]

export const CategoriesSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-3">
            Browse by Category
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Explore opportunities that match your goals and documentation status
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-lg hover:border-[#0F4C81]/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} border`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0F4C81] mb-1 group-hover:text-[#0d3f6b]">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3 hidden md:block">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5A623]">{cat.count} listings</span>
                  <ArrowRight size={16} className="text-[#0F4C81] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
