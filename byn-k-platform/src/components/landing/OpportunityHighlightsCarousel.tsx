'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getOpportunities } from '@/lib/api'
import { buildOpportunityPath } from '@/lib/opportunity-utils'
import type { Opportunity } from '@/types'

const categoryNames: Record<string, string> = {
  job: 'Jobs & placements',
  scholarship: 'Scholarships',
  internship: 'Internships',
  training: 'Trainings',
  fellowship: 'Fellowships',
}

const formatDeadline = (value?: string) => {
  if (!value) return 'Open until filled'
  const deadline = new Date(value)
  return deadline.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const categoryColor = (category?: string) => {
  switch (category) {
    case 'scholarship':
      return 'bg-secondary/15 text-secondary border-secondary/35'
    case 'internship':
      return 'bg-primary/15 text-primary-light border-primary/35'
    case 'training':
      return 'bg-white/10 text-slate-100 border-white/20'
    case 'fellowship':
      return 'bg-emerald-400/15 text-emerald-200 border-emerald-300/25'
    case 'job':
    default:
      return 'bg-accent/15 text-red-200 border-accent/30'
  }
}

export function OpportunityHighlightsCarousel() {
  const [highlights, setHighlights] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchHighlights = async () => {
      try {
        const response = await getOpportunities({
          page_size: 5,
          ordering: '-created_at',
        })
        if (isMounted) {
          setHighlights(response.data.slice(0, 4))
          setActiveIndex(0)
          setLoading(false)
        }
      } catch (err) {
        console.error('Unable to load highlight opportunities:', err)
        if (isMounted) {
          setError('Unable to refresh highlights right now.')
          setLoading(false)
        }
      }
    }

    fetchHighlights()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (highlights.length === 0) return undefined
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % highlights.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [highlights])

  const activeHighlight = highlights[activeIndex]

  return (
    <div className="byn-panel-dark space-y-4 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.32em] text-secondary">
          Opportunity highlights
        </p>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-slate-300">
          live slider
        </p>
      </div>

      <div className="min-h-[220px] rounded-xl border border-primary/20 bg-white/[0.06] p-4">
        {loading ? (
          <p className="text-sm text-slate-300">Loading highlighted opportunities...</p>
        ) : error ? (
          <p className="text-sm text-red-200">{error}</p>
        ) : !activeHighlight ? (
          <p className="text-sm text-slate-300">No new highlights yet. Check back in a bit.</p>
        ) : (
          <div className="space-y-3 animate-slide-in-right">
            <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.22em] ${categoryColor(activeHighlight.category)}`}>
              {categoryNames[activeHighlight.category || 'job'] ?? 'Opportunity'}
            </div>
            <h3 className="text-lg font-black text-white">{activeHighlight.title}</h3>
            {activeHighlight.organization_name && (
              <p className="text-sm text-slate-300">{activeHighlight.organization_name}</p>
            )}
            {activeHighlight.location && (
              <p className="text-sm text-slate-300">
                Location: <span className="font-semibold text-white">{activeHighlight.location}</span>
              </p>
            )}
            <p className="text-sm text-slate-300">
              Deadline: <span className="font-semibold text-white">{formatDeadline(activeHighlight.deadline || undefined)}</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300 line-clamp-3">
              {activeHighlight.description_en || 'Verified opportunity curated for refugee youth in Kenya.'}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[0.65rem] font-semibold tracking-[0.24em] text-slate-400">
                Updated {new Date(activeHighlight.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
              </span>
              <Link
                href={buildOpportunityPath(activeHighlight.category, activeHighlight.slug)}
                className="byn-button-primary px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] transition"
              >
                View Details
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-slate-400">
        <span>partnered with RCK, IKEA, Amahoro Coalition</span>
        <span>{highlights.length ? `${activeIndex + 1}/${highlights.length}` : '0/0'}</span>
      </div>
    </div>
  )
}

export default OpportunityHighlightsCarousel
