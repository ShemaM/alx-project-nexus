import Link from 'next/link'
import { Briefcase, GraduationCap, BookOpen, Award, Lightbulb, ArrowRight } from 'lucide-react'
import type { CategoryCounts } from '@/lib/api'

interface CategoryGridProps {
  counts: CategoryCounts
}

const categories = [
  {
    key: 'jobs' as const,
    label: 'Jobs',
    icon: Briefcase,
    href: '/opportunities?category=job',
    description: 'Full-time, part-time & contract roles at NGOs and community organisations.',
  },
  {
    key: 'scholarships' as const,
    label: 'Scholarships',
    icon: GraduationCap,
    href: '/opportunities?category=scholarship',
    description: 'Fully-funded university scholarships and postgraduate awards — Mastercard Foundation, KCDF, and more.',
  },
  {
    key: 'internships' as const,
    label: 'Internships',
    icon: BookOpen,
    href: '/opportunities?category=internship',
    description: 'Paid and unpaid internships at NGOs, UN agencies, and development organisations.',
  },
  {
    key: 'fellowships' as const,
    label: 'Fellowships',
    icon: Award,
    href: '/opportunities?category=fellowship',
    description: 'Leadership, research, and professional development fellowships.',
  },
  {
    key: 'training' as const,
    label: 'Training',
    icon: Lightbulb,
    href: '/opportunities?category=training',
    description: 'Skills workshops, digital literacy courses, and capacity-building programs.',
  },
]

export function CategoryGrid({ counts }: CategoryGridProps) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-dark">
              Browse by category
            </p>
            <h2 className="font-syne text-3xl font-extrabold tracking-[-0.5px] text-navy md:text-4xl">
              What are you looking for?
            </h2>
          </div>
          <Link
            href="/opportunities"
            className="flex items-center gap-1.5 text-sm font-bold text-primary transition hover:underline"
          >
            View all opportunities
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* List rows */}
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex items-center gap-5 rounded-xl border border-slate-200 border-l-[4px] border-l-primary bg-white px-5 py-4 shadow-sm transition-all duration-150 hover:border-l-navy hover:bg-blue-50/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 transition group-hover:bg-primary/14">
                <cat.icon size={22} className="text-primary" aria-hidden />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="font-syne text-[15px] font-extrabold text-navy">
                    {cat.label}
                  </h3>
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-[11px] font-extrabold text-navy">
                    {counts[cat.key].toLocaleString()}
                  </span>
                </div>
                <p className="line-clamp-1 text-[13px] leading-[1.55] text-slate-500">
                  {cat.description}
                </p>
              </div>

              {/* Arrow */}
              <ArrowRight
                size={18}
                className="shrink-0 text-primary opacity-0 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
