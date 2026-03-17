'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getOpportunities } from '@/lib/api'
import type { Opportunity, OpportunityCategory } from '@/types'
import { buildOpportunityPath } from '@/lib/opportunity-utils'

interface OpportunityExplorerProps {
  searchOverride?: string
}

const categoryOptions: { value: OpportunityCategory | ''; label: string }[] = [
  { value: '', label: 'All categories' },
  { value: 'job', label: 'Jobs' },
  { value: 'scholarship', label: 'Scholarships' },
  { value: 'internship', label: 'Internships' },
  { value: 'fellowship', label: 'Fellowships' },
  { value: 'training', label: 'Training' },
]

const categoryNames: Record<OpportunityCategory, string> = {
  job: 'Jobs',
  scholarship: 'Scholarships',
  internship: 'Internships',
  fellowship: 'Fellowships',
  training: 'Training',
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Convert milliseconds into a compact countdown string for deadlines.
const formatDuration = (diff: number | undefined) => {
  if (diff === undefined) return ''
  const totalSeconds = Math.floor(diff / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)

  const parts = []
  if (days) parts.push(`${days}d`)
  parts.push(`${hours.toString().padStart(2, '0')}h`)
  parts.push(`${minutes.toString().padStart(2, '0')}m`)
  parts.push(`${seconds.toString().padStart(2, '0')}s`)

  return parts.join(' ')
}

// Human-readable deadline label used on each opportunity card.
const formatDeadline = (value?: string) => {
  if (!value) return 'Open'
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Stateful explorer that queries the API with category/search filters and renders cards with timers. */
export function OpportunityExplorer({ searchOverride }: OpportunityExplorerProps) {
  const [search, setSearch] = useState(searchOverride ?? '')
  const [category, setCategory] = useState('')
  const [results, setResults] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (typeof searchOverride === 'string') {
      setSearch(searchOverride)
    }
  }, [searchOverride])

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchResults()
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search, category])

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Debounced API call that respects current filters and search query.
  const fetchResults = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getOpportunities({
        search: search.trim() || undefined,
        category: (category as OpportunityCategory) || undefined,
        page_size: 6,
      })
      setResults(response?.data || [])
    } catch (err) {
      console.error('Failed to load opportunities:', err)
      setError('Unable to load opportunities right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#2D8FDD]">Opportunity search</p>
        <h3 className="text-xl font-semibold text-slate-900">Scholarships, internships, trainings & more</h3>
        <p className="text-sm text-slate-600">
          Filter the curated list and uncover the latest opportunity matching your interests.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-600">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1 rounded-2xl border border-[#2D8FDD]/40 px-3 py-2 text-sm text-slate-900 focus:border-[#2D8FDD] focus:outline-none"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Fetching opportunities…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-slate-500">No matches. Try a broader search or check back soon.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((opportunity) => {
            const categoryKey = (opportunity.category as OpportunityCategory) || 'job'
            const categoryLabel = categoryNames[categoryKey] || 'Opportunity'
            const deadlineMs = opportunity.deadline ? new Date(opportunity.deadline).getTime() : undefined
            const timeRemaining = deadlineMs ? deadlineMs - now : undefined
            const expired = timeRemaining !== undefined && timeRemaining <= 0
            const closingSoon = timeRemaining !== undefined && timeRemaining <= 3 * MS_PER_DAY
            const countdownText =
              expired === false && timeRemaining !== undefined
                ? `Ends in ${formatDuration(Math.max(timeRemaining, 0))}`
                : expired
                ? 'Expired'
                : 'Open until filled'

            return (
              <li key={opportunity.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-2 text-sm text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {categoryLabel}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900">{opportunity.title}</h4>
                  <p className="text-sm text-slate-600">{opportunity.organization_name}</p>
                  {opportunity.location && (
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                      Location:{' '}
                      <span className="text-slate-600 normal-case">{opportunity.location}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
                    <span className="rounded-full border border-[#2D8FDD]/40 px-3 py-1">
                      {categoryLabel}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.55rem] font-bold tracking-[0.3em] ${
                        expired
                          ? 'border-slate-200 bg-slate-100 text-slate-500'
                          : closingSoon
                          ? 'border-[#D52B2B] bg-[#FEE2E2] text-[#B91C1C]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {countdownText}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={buildOpportunityPath(categoryKey, opportunity.slug)}
                    className="rounded-full border border-[#F5D300] bg-[#F5D300] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#091336] transition hover:bg-[#ffe533]"
                  >
                    View details →
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default OpportunityExplorer
