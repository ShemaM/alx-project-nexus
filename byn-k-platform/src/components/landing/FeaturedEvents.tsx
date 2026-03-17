'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Event } from '@/types'

interface FeaturedEventsProps {
  events: Event[]
}

const MS_PER_DAY = 1000 * 60 * 60 * 24
const MS_PER_HOUR = 1000 * 60 * 60
const MS_PER_MINUTE = 1000 * 60

// Turn a delta into a multi-part countdown string for upcoming events.
const formatCountdown = (diff: number) => {
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

// Render a short past date label when events have already started.
const formatPastDate = (value?: string) => {
  if (!value) return 'TBA'
  return new Date(value).toLocaleString('en-KE', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Safe helper that resolves an event's start timestamp for ordering logic.
const getStartTimestamp = (event: Event) =>
  event.start_time ? new Date(event.start_time).getTime() : Infinity

/** Displays upcoming events with countdown badges and a small past-events list. */
export function FeaturedEvents({ events }: FeaturedEventsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [now, setNow] = useState(Date.now())
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aTime = getStartTimestamp(a)
      const bTime = getStartTimestamp(b)
      return aTime - bTime
    })
  }, [events])

  if (events.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-8 text-center text-sm text-slate-600">
        We are preparing new webinars and conferences. Check back soon for the featured story.
      </div>
    )
  }

  const upcomingEvents = sortedEvents.filter((event) => getStartTimestamp(event) > now)
  const pastEvents = sortedEvents.filter((event) => getStartTimestamp(event) <= now)

  return (
    <div className="space-y-6">
      {upcomingEvents.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 text-center text-sm text-slate-600">
          No live events are scheduled right now. Browse the past sessions or check back later for new
          announcements.
        </div>
      ) : (
        upcomingEvents.map((event) => {
          const startMs = event.start_time ? new Date(event.start_time).getTime() : undefined
          const diffMs = startMs ? Math.max(startMs - now, 0) : undefined
          const classification =
            (event.category && event.category.charAt(0).toUpperCase() + event.category.slice(1)) || 'Community'
          const countdownText = event.is_live
            ? 'Happening now'
            : diffMs
            ? `Starts in ${formatCountdown(diffMs)}`
            : 'Date TBD'
          const closingSoon = diffMs !== undefined && diffMs <= 2 * MS_PER_DAY

          return (
            <article
              key={event.id}
              className={`overflow-hidden rounded-3xl border ${
                expandedId === event.id ? 'border-[#D52B2B]' : 'border-slate-100'
              } bg-white shadow-lg transition hover:-translate-y-0.5`}
            >
              <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#2D8FDD]">{classification}</p>
                  <h3 className="text-xl font-semibold text-slate-900 md:text-2xl">{event.title}</h3>
                  {event.partner && <p className="text-sm text-slate-500">Hosted by {event.partner}</p>}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
            <span
              className={`rounded-full px-3 py-1 ${
                closingSoon
                  ? 'bg-[#D52B2B]/10 text-[#B91C1C]'
                  : 'border border-[#2D8FDD]/40 text-[#2D8FDD]'
              }`}
            >
              {hasMounted ? countdownText : event.is_live ? 'Happening now' : 'Starts soon'}
            </span>
                    {event.is_virtual && (
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-600">Virtual</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link href="/events" className="text-[#2D8FDD] font-semibold hover:underline">
                    More events
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    className="rounded-full border border-[#F5D300] bg-[#F5D300] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#091336] transition hover:bg-[#ffe533]"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              {expandedId === event.id && (
                <div className="border-t border-slate-100 px-6 py-5 text-sm text-slate-700">
                  {event.description && <p className="mb-3">{event.description}</p>}
                  {event.requirements && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Requirements</p>
                      <p>{event.requirements}</p>
                    </>
                  )}
                  <div className="mt-3 space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {event.location && (
                      <p className="text-slate-700">
                        Location: <span className="normal-case text-slate-600">{event.location}</span>
                      </p>
                    )}
                    {event.directions && (
                      <p className="text-slate-700">
                        Directions: <span className="normal-case text-slate-600">{event.directions}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </article>
          )
        })
      )}

      {pastEvents.length > 0 && (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Past events</p>
              <h4 className="mt-1 text-base font-semibold text-slate-900">Past events & opportunities</h4>
            </div>
            <Link href="/events" className="text-sm font-semibold text-[#2D8FDD] underline underline-offset-4">
              Browse archive
            </Link>
          </div>
          <div className="space-y-3 pt-2 text-sm text-slate-600">
            {pastEvents.slice(0, 3).map((event) => (
              <div
                key={`past-${event.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Ended {formatPastDate(event.start_time)}
                  </p>
                </div>
                <Link href="/events" className="text-xs font-semibold text-[#2D8FDD]">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeaturedEvents
