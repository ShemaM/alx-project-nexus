'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Event } from '@/types'

interface FeaturedEventsProps {
  events: Event[]
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

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

const formatPastDate = (value?: string) => {
  if (!value) return 'TBA'
  return new Date(value).toLocaleString('en-KE', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const getStartTimestamp = (event: Event) =>
  event.start_time ? new Date(event.start_time).getTime() : Infinity

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
      <div className="rounded-xl border border-primary/15 bg-white p-8 text-center text-sm font-medium text-slate-700">
        We are preparing new webinars and conferences. Check back soon for the featured story.
      </div>
    )
  }

  const upcomingEvents = sortedEvents.filter((event) => getStartTimestamp(event) > now)
  const pastEvents = sortedEvents.filter((event) => getStartTimestamp(event) <= now)

  return (
    <div className="space-y-6">
      {upcomingEvents.length === 0 ? (
        <div className="rounded-xl border border-primary/15 bg-white p-6 text-center text-sm font-medium text-slate-700">
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
              className={`overflow-hidden rounded-xl border ${
                expandedId === event.id ? 'border-accent' : 'border-primary/15'
              } bg-white shadow-[0_18px_45px_-34px_rgba(6,16,39,0.75)] transition hover:-translate-y-0.5 hover:border-primary/40`}
            >
              <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.28em] text-primary">{classification}</p>
                  <h3 className="text-xl font-black text-slate-950 md:text-2xl">{event.title}</h3>
                  {event.partner && <p className="text-sm font-medium text-slate-600">Hosted by {event.partner}</p>}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em]">
                    <span
                      className={`rounded-lg px-3 py-1 ${
                        closingSoon
                          ? 'bg-accent/10 text-[#B91C1C]'
                          : 'border border-primary/40 text-primary'
                      }`}
                    >
                      {hasMounted ? countdownText : event.is_live ? 'Happening now' : 'Starts soon'}
                    </span>
                    {event.is_virtual && (
                      <span className="rounded-lg border border-slate-200 px-3 py-1 text-slate-700">Virtual</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link href="/events" className="font-bold text-primary hover:underline">
                    More events
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                    className="byn-button-primary px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              {expandedId === event.id && (
                <div className="border-t border-primary/15 px-6 py-5 text-sm leading-6 text-slate-700">
                  {event.description && <p className="mb-3">{event.description}</p>}
                  {event.requirements && (
                    <>
                      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-primary">Requirements</p>
                      <p>{event.requirements}</p>
                    </>
                  )}
                  <div className="mt-3 space-y-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
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
        <div className="space-y-4 rounded-xl border border-primary/15 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(6,16,39,0.75)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-primary">Past events</p>
              <h4 className="mt-1 text-base font-black text-slate-950">Past events & opportunities</h4>
            </div>
            <Link href="/events" className="text-sm font-bold text-primary underline underline-offset-4">
              Browse archive
            </Link>
          </div>
          <div className="space-y-3 pt-2 text-sm text-slate-600">
            {pastEvents.slice(0, 3).map((event) => (
              <div
                key={`past-${event.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-950">{event.title}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Ended {formatPastDate(event.start_time)}
                  </p>
                </div>
                <Link href="/events" className="text-xs font-bold text-primary">
                  View details
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
