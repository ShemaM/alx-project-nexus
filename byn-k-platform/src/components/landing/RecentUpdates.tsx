'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Event } from '@/types'
import OpportunityExplorer from './OpportunityExplorer'
import FeaturedEvents from './FeaturedEvents'
import OpportunityHighlightsCarousel from './OpportunityHighlightsCarousel'

interface RecentUpdatesProps {
  events: Event[]
  errorMessage?: string
}

const fuzzyMatch = (source: string | undefined, query: string) =>
  typeof source === 'string' && source.toLowerCase().includes(query)

/** Combines the search-driven explorer, event highlights, and status banners into the updates section. */
export function RecentUpdatesSection({ events, errorMessage }: RecentUpdatesProps) {
  const [generalSearch, setGeneralSearch] = useState('')
  const normalizedSearch = generalSearch.trim().toLowerCase()

  const filteredEvents = useMemo(() => {
    // Filter the curated events list by a shared general search string.
    if (!normalizedSearch) return events
    return events.filter(
      (event) =>
        fuzzyMatch(event.title, normalizedSearch) ||
        fuzzyMatch(event.description || undefined, normalizedSearch) ||
        fuzzyMatch(event.partner || undefined, normalizedSearch)
    )
  }, [events, normalizedSearch])

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-slate-500">
              Recent updates
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Events and opportunities curated for Banyamulenge Youth Kenya
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Live webinars, conferences, scholarships, internships, trainings, and fellowships across
              Kenya that bundle requirements, directions, and the latest availability.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden text-sm font-semibold text-[#2D8FDD] md:inline-flex"
          >
            Show all events →
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
            General search (events + opportunities)
            <input
              aria-label="Search all updates"
              type="search"
              value={generalSearch}
              onChange={(event) => setGeneralSearch(event.target.value)}
              placeholder="Search by title, partner, or keyword"
              className="w-full rounded-2xl border border-[#2D8FDD]/40 px-4 py-2 text-sm text-slate-900 focus:border-[#2D8FDD] focus:outline-none"
            />
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
          <div className="space-y-6">
            <OpportunityExplorer searchOverride={generalSearch} />
          </div>

          <div className="space-y-6">
            <OpportunityHighlightsCarousel />

            {errorMessage && (
              <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-700">
                {errorMessage} Please refresh or check back soon.
              </div>
            )}

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                    Live events
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Webinars, conferences, and meetups
                  </h3>
                </div>
                <Link
                  href="/events"
                  className="text-sm font-semibold text-[#2D8FDD] underline underline-offset-4"
                >
                  View all events
                </Link>
              </div>
              <FeaturedEvents events={filteredEvents} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentUpdatesSection
