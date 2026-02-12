import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Building,
  Award,
  Calendar,
  FileText,
  MapPin,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { getCategoryCounts, getOpportunities } from '@/lib/api'
import { OpportunityCategory, Opportunity } from '@/types'
import CategoryBrowseFilters, { CategorySortControl } from '@/components/filters/CategoryBrowseFilters'
import { buildOpportunityPath } from '@/lib/opportunity-utils'

// Force dynamic rendering to fetch data at runtime
export const dynamic = 'force-dynamic'

// Map URL category to Django model category
const categoryUrlToDb: Record<string, string> = {
  jobs: 'job',
  scholarships: 'scholarship',
  internships: 'internship',
  fellowships: 'fellowship',
  training: 'training',
}

// Category metadata
const categoryMeta: Record<
  string,
  {
    title: string
    description: string
    icon: React.ElementType
    color: string
    accent: string
    badge: string
    topBar: string
  }
> = {
  jobs: {
    title: 'Jobs',
    description: 'Find verified job opportunities suitable for your documentation status',
    icon: Briefcase,
    color: 'bg-yellow-50 text-[#F5D300]',
    accent: 'text-[#A67C00]',
    badge: 'bg-[#F5D300]/20 text-[#A67C00] border-[#F5D300]/40',
    topBar: 'from-[#F5D300] to-[#E8C700]',
  },
  scholarships: {
    title: 'Scholarships',
    description: 'Discover scholarship programs for refugees and displaced youth',
    icon: GraduationCap,
    color: 'bg-purple-50 text-purple-600',
    accent: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    topBar: 'from-purple-400 to-fuchsia-500',
  },
  internships: {
    title: 'Internships',
    description: 'Gain valuable work experience through internship programs',
    icon: Building,
    color: 'bg-blue-50 text-[#2D8FDD]',
    accent: 'text-[#1E6BB8]',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    topBar: 'from-[#2D8FDD] to-cyan-500',
  },
  fellowships: {
    title: 'Fellowships',
    description: 'Access fellowship opportunities for professional development',
    icon: Award,
    color: 'bg-green-50 text-green-600',
    accent: 'text-green-700',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    topBar: 'from-emerald-500 to-green-600',
  },
  training: {
    title: 'Training',
    description: 'Build practical skills through training and certification programs',
    icon: FileText,
    color: 'bg-sky-50 text-sky-600',
    accent: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    topBar: 'from-sky-500 to-cyan-500',
  }
}

const dbCategoryMeta: Record<string, { badge: string; topBar: string; label: string }> = {
  job: { badge: 'bg-[#F5D300]/20 text-[#8F6F00] border-[#F5D300]/40', topBar: 'from-[#F5D300] to-[#E8C700]', label: 'Jobs' },
  scholarship: { badge: 'bg-purple-100 text-purple-700 border-purple-200', topBar: 'from-purple-400 to-fuchsia-500', label: 'Scholarships' },
  internship: { badge: 'bg-sky-100 text-sky-700 border-sky-200', topBar: 'from-[#2D8FDD] to-cyan-500', label: 'Internships' },
  fellowship: { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', topBar: 'from-emerald-500 to-green-600', label: 'Fellowships' },
  training: { badge: 'bg-orange-100 text-orange-700 border-orange-200', topBar: 'from-orange-400 to-amber-500', label: 'Training' },
}

const categoryCountsOrder: Array<{ key: string; label: string; iconKey: 'jobs' | 'scholarships' | 'internships' | 'fellowships' | 'training' }> = [
  { key: 'jobs', label: 'Jobs', iconKey: 'jobs' },
  { key: 'scholarships', label: 'Scholarships', iconKey: 'scholarships' },
  { key: 'internships', label: 'Internships', iconKey: 'internships' },
  { key: 'fellowships', label: 'Fellowships', iconKey: 'fellowships' },
  { key: 'training', label: 'Training', iconKey: 'training' },
]

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return 'TBD'
  return new Date(dateString).toLocaleDateString('en-US')
}

function opportunityUrl(opp: Opportunity) {
  return buildOpportunityPath(opp.category, opp.slug)
}

function buildQueryString(params: Record<string, string>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  return search.toString()
}

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: Readonly<PageProps>) {
  const { category } = await params
  const resolvedSearchParams = await searchParams
  
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

  // Fetch opportunities from Django API filtered by category and other params
  let opportunities: Opportunity[] = []
  const counts = await getCategoryCounts()
  try {
    const dbCategory = categoryUrlToDb[category] || category
    const normalizedFilters = Object.fromEntries(
      Object.entries(resolvedSearchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    )

    const parsedFilters: Record<string, unknown> = { ...normalizedFilters }
    if (normalizedFilters.work_modes) {
      parsedFilters.work_modes = normalizedFilters.work_modes.split(',').filter(Boolean)
    }

    const response = await getOpportunities({
      ...(parsedFilters as any),
      category: dbCategory as OpportunityCategory,
    })
    opportunities = response?.data || []
  } catch (error) {
    console.error('Error fetching opportunities:', error)
  }

  const Icon = meta.icon
  const normalizedFilters = Object.fromEntries(
    Object.entries(resolvedSearchParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  )

  const workModeCounts = opportunities.reduce<Record<string, number>>((acc, opp) => {
    const key = opp.work_mode || 'hybrid'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#EEF2F7]">
      <Navbar />

      <section className="bg-white border-b border-[#DDE5EF]">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to All Opportunities
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${meta.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">Discover Opportunities</h1>
              <p className="text-slate-600 text-xl mt-1">
                Browse {opportunities.length} verified opportunities for your future
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <CategoryBrowseFilters
            categories={categoryCountsOrder.map((item) => {
              const nextFilters = { ...normalizedFilters }
              const filteredFilters = Object.fromEntries(
                Object.entries(nextFilters).filter(([, value]) => value !== undefined)
              ) as Record<string, string>
              const query = buildQueryString(filteredFilters)
              return {
                key: item.key,
                label: item.label,
                count: counts[item.key as keyof typeof counts] || 0,
                href: query ? `/categories/${item.key}?${query}` : `/categories/${item.key}`,
                icon: item.iconKey,
                active: category === item.key,
              }
            })}
            workModeCounts={workModeCounts}
          />

          <div>
            <div className="mb-6 flex items-center justify-end">
              <CategorySortControl />
            </div>

            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-medium text-[#2D8FDD]">
                {meta.title}
                <span className="text-[#2D8FDD]/70">x</span>
              </span>
            </div>

            {opportunities.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {opportunities.map((opp) => {
                  const cMeta = dbCategoryMeta[opp.category || 'job'] || dbCategoryMeta.job
                  const locationLabel = opp.city || opp.location || 'Remote'
                  const summary =
                    opp.description_en ||
                    opp.description_sw ||
                    opp.description_fr ||
                    `${opp.organization_name} is accepting applications for this ${cMeta.label.toLowerCase()} opportunity.`

                  return (
                    <article key={opp.id} className="rounded-2xl border border-[#DDE5EF] bg-white overflow-hidden shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
                      <div className={`h-1.5 w-full bg-linear-to-r ${cMeta.topBar}`} />
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${cMeta.badge}`}>
                            <Sparkles size={12} />
                            {cMeta.label}
                          </span>
                          {opp.is_verified && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-emerald-100 text-emerald-700 border-emerald-200">
                              <CheckCircle2 size={12} />
                              Verified
                            </span>
                          )}
                          {opp.is_featured && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-amber-100 text-amber-700 border-amber-200">
                              <Sparkles size={12} />
                              Featured
                            </span>
                          )}
                          {opp.brochure_url && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-blue-100 text-blue-700 border-blue-200">
                              <FileText size={12} />
                              Brochure
                            </span>
                          )}
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{opp.title}</h3>
                        <p className="text-slate-700 font-medium mb-4">{opp.organization_name}</p>

                        <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-2">
                          <span className="inline-flex items-center gap-2">
                            <MapPin size={15} className="text-slate-400" />
                            {locationLabel}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="capitalize">{opp.work_mode === 'onsite' ? 'On-site' : (opp.work_mode || 'Hybrid')}</span>
                        </div>

                        <div className="inline-flex items-center gap-2 text-slate-700 mb-4">
                          <Calendar size={15} className="text-slate-400" />
                          <span className="font-medium">Deadline: {formatDate(opp.deadline)}</span>
                        </div>

                        <p className="text-slate-600 line-clamp-2 text-[15px]">{summary}</p>

                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm text-slate-400">
                            Posted {formatDate(opp.created_at)}
                          </span>
                          <Link href={opportunityUrl(opp)} className="inline-flex items-center gap-1 text-[#2D8FDD] hover:text-[#1E6BB8] font-semibold">
                            View Details
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-xl border border-[#E2E8F0]">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${meta.color}`}>
                  <Icon size={32} />
                </div>
                <p className="text-lg font-medium">No {meta.title.toLowerCase()} found</p>
                <p className="text-sm mt-2">Check back later for new listings or clear your filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
