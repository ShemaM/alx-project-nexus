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

// Format deadline dates for timeline info inside carousel slides.
const formatDeadline = (value?: string) => {
  if (!value) return 'Open until filled'
  const deadline = new Date(value)
  return deadline.toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Pick pill colors for categories so the highlight card stays vibrant.
const categoryColor = (category?: string) => {
  switch (category) {
    case 'scholarship':
      return 'bg-[#FDE68A]/60 text-[#A16207]'
    case 'internship':
      return 'bg-blue-100 text-[#1D4ED8]'
    case 'training':
      return 'bg-[#DBEAFE] text-[#1E3A8A]'
    case 'fellowship':
      return 'bg-[#DCFCE7] text-[#047857]'
    case 'job':
    default:
      return 'bg-[#FEF3C7] text-[#B45309]'
  }
}

/** Auto-rotating carousel that surfaces featured opportunities with a slider animation. */
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
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500">
          Opportunity highlights
        </p>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#2D8FDD]">
          auto slider
        </p>
      </div>

      <div className="min-h-[220px] rounded-2xl bg-slate-50/80 p-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading highlighted opportunities…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !activeHighlight ? (
          <p className="text-sm text-slate-500">No new highlights yet. Check back in a bit.</p>
        ) : (
          <div className="space-y-3 animate-slide-in-right">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] ${categoryColor(activeHighlight.category)}`}>
              {categoryNames[activeHighlight.category || 'job'] ?? 'Opportunity'}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{activeHighlight.title}</h3>
            {activeHighlight.organization_name && (
              <p className="text-sm text-slate-600">{activeHighlight.organization_name}</p>
            )}
            {activeHighlight.location && (
              <p className="text-sm text-slate-500">
                Location: <span className="font-semibold text-slate-700">{activeHighlight.location}</span>
              </p>
            )}
            <p className="text-sm text-slate-500">
              Deadline: <span className="font-semibold text-slate-700">{formatDeadline(activeHighlight.deadline || undefined)}</span>
              </p>
              <p className="mt-4 text-sm text-slate-600 line-clamp-3">
              {activeHighlight.description_en || 'Trusted opportunity curated by Banyamulenge Youth Kenya.'}
              </p>
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-slate-500">
                Updated {new Date(activeHighlight.created_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
              </span>
              <Link
                href={buildOpportunityPath(activeHighlight.category, activeHighlight.slug)}
                className="rounded-full border border-[#F5D300] bg-[#F5D300] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#091336] transition hover:bg-[#ffe533]"
              >
                View Details
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
        <span>partnered with RCK, IKEA, Amahoro Coalition</span>
        <span>{highlights.length ? `${activeIndex + 1}/${highlights.length}` : '0/0'}</span>
      </div>
    </div>
  )
}

export default OpportunityHighlightsCarousel
