'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Briefcase, GraduationCap, Building, Award, BookOpen, CheckCircle2, SlidersHorizontal } from 'lucide-react'

interface CategoryCountItem {
  key: string
  label: string
  count: number
  href: string
  icon: 'jobs' | 'scholarships' | 'internships' | 'fellowships' | 'training'
  active: boolean
}

interface CategoryBrowseFiltersProps {
  categories: CategoryCountItem[]
  workModeCounts: Record<string, number>
}

const workModesOrder = ['remote', 'onsite', 'hybrid'] as const

const sortOptions = [
  { label: 'Most Recent', value: '-created_at' },
  { label: 'Deadline Soon', value: 'deadline' },
  { label: 'Title A-Z', value: 'title' },
]

function categoryIcon(icon: CategoryCountItem['icon']) {
  if (icon === 'jobs') return Briefcase
  if (icon === 'scholarships') return GraduationCap
  if (icon === 'internships') return Building
  if (icon === 'training') return BookOpen
  return Award
}

export default function CategoryBrowseFilters({ categories, workModeCounts }: Readonly<CategoryBrowseFiltersProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedWorkModes = (searchParams.get('work_modes') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const verifiedOnly = searchParams.get('is_verified') === 'true'

  const buildSearch = (mutator: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    mutator(params)
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const toggleWorkMode = (mode: string) => {
    const nextModes = selectedWorkModes.includes(mode)
      ? selectedWorkModes.filter((item) => item !== mode)
      : [...selectedWorkModes, mode]

    router.push(buildSearch((params) => {
      if (nextModes.length > 0) {
        params.set('work_modes', nextModes.join(','))
      } else {
        params.delete('work_modes')
      }
    }))
  }

  const toggleVerified = () => {
    router.push(buildSearch((params) => {
      if (verifiedOnly) {
        params.delete('is_verified')
      } else {
        params.set('is_verified', 'true')
      }
    }))
  }

  return (
    <aside className="bg-white border border-[#DDE5EF] rounded-2xl p-6 h-fit">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">Filters</h2>
        <Link href={pathname} className="text-sm font-medium text-[#2D8FDD] hover:text-[#1E6BB8]">
          Clear all
        </Link>
      </div>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Category</h3>
          <div className="space-y-4">
            {categories.map((item) => {
              const Icon = categoryIcon(item.icon)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900"
                >
                  <span className="flex items-center gap-3">
                    <input type="checkbox" checked={item.active} readOnly className="rounded border-slate-300" />
                    <Icon size={16} className="text-slate-400" />
                    {item.label}
                  </span>
                  <span className="text-slate-400 text-sm">{item.count}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Work Type</h3>
          <div className="space-y-4">
            {workModesOrder.map((mode) => {
              const checked = selectedWorkModes.includes(mode)
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleWorkMode(mode)}
                  className="w-full flex items-center justify-between text-slate-700 capitalize hover:text-slate-900"
                >
                  <span className="flex items-center gap-3">
                    <input type="checkbox" checked={checked} readOnly className="rounded border-slate-300" />
                    {mode === 'onsite' ? 'On-site' : mode}
                  </span>
                  <span className="text-slate-400 text-sm">{workModeCounts[mode] || 0}</span>
                </button>
              )
            })}
          </div>
        </div>

        <button type="button" onClick={toggleVerified} className="w-full flex items-center gap-3 text-slate-700 hover:text-slate-900">
          <input type="checkbox" checked={verifiedOnly} readOnly className="rounded border-slate-300" />
          <CheckCircle2 size={16} className="text-emerald-500" />
          Verified opportunities only
        </button>
      </div>
    </aside>
  )
}

export function CategorySortControl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentOrdering = searchParams.get('ordering') || '-created_at'

  const updateOrdering = (ordering: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('ordering', ordering)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="inline-flex items-center gap-2 bg-white border border-[#DDE5EF] rounded-xl px-3 py-2 text-slate-700">
      <SlidersHorizontal size={16} className="text-slate-500" />
      <select
        value={currentOrdering}
        onChange={(e) => updateOrdering(e.target.value)}
        className="bg-transparent text-sm font-medium outline-none"
        aria-label="Sort opportunities"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
