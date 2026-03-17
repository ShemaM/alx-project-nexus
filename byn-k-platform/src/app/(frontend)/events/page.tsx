import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { getEvents } from '@/lib/api'
import Link from 'next/link'
import type { EventCategory, Event } from '@/types'

export const metadata = {
  title: 'Events | Banyamulenge Youth Kenya Platform',
  description:
    'Live webinars, conferences, and community events hosted by partners like RCK, IKEA, and Amahoro Coalition in Kenya and beyond.',
}

export const revalidate = 60

// Friendly label map so event categories display readable headings in the UI.
const classificationLabels: Record<EventCategory, string> = {
  tech: 'Tech & Innovation',
  policy: 'Policy & Governance',
  community: 'Community Action',
  climate: 'Climate & Sustainability',
}

const formatCountdown = (startTime?: string, isLive?: boolean) => {
  // Build a relative countdown string or fallback messaging for the CTA.
  if (isLive) return 'Happening now'
  if (!startTime) return 'Starts soon'

  const now = new Date()
  const start = new Date(startTime)
  const diffMs = start.getTime() - now.getTime()

  if (diffMs <= 0) return 'Starting soon'

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)

  return `Starts in ${parts.join(' ') || '<1m'}`
}

const formatDateLabel = (startTime?: string) => {
  // Format the native start_time for the schedule section.
  if (!startTime) return 'TBA'
  return new Date(startTime).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const splitLines = (value?: string) => {
  // Keep multi-line fields user-friendly by splitting into list items.
  return value?.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) || []
}

/** Page responsible for listing the curated events feed with countdowns and contact CTAs. */
export default async function EventsPage() {
  let events: Event[] = []
  let fetchError = false

  try {
    const response = await getEvents(6)
    events = response.results || []
  } catch (error) {
    console.error('Error fetching events:', error)
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="bg-gradient-to-br from-[#1E3A5F] via-[#2D8FDD] to-[#5BA8E6] py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <CalendarDays className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-white">Live events & conferences</h1>
          <p className="mt-4 text-lg text-blue-100">
            Connect with partners like RCK, IKEA, and the Amahoro Coalition over workshops, summits, and
            webinars that are happening in Kenya and regionally.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {fetchError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Failed to load events. Please try again shortly.
            </div>
          )}

          {events.length === 0 && !fetchError ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              Events will appear here soon. Keep checking for training sessions, fairs, and community conversations.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => {
                const requirements = splitLines(event.requirements || undefined)
                const classification = classificationLabels[event.category as EventCategory] ?? 'Community Action'
                const countdown = formatCountdown(event.start_time, event.is_live)
                const startsAt = formatDateLabel(event.start_time)
                return (
                  <article
                    key={event.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-0.5"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                            {classification}
                          </p>
                          <h2 className="mt-1 text-2xl font-semibold text-slate-900">{event.title}</h2>
                          {event.partner && (
                            <p className="text-sm text-slate-500">Hosted by {event.partner}</p>
                          )}
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-xs uppercase text-slate-400">Countdown</p>
                          <p className="text-base font-semibold text-[#1E6BB8]">{countdown}</p>
                          <p className="text-[0.65rem] text-slate-400">{startsAt}</p>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-sm text-slate-600">{event.description}</p>
                      )}
                      {requirements.length > 0 && (
                        <div className="text-sm text-slate-500">
                          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
                            Requirements
                          </p>
                          <ul className="mt-2 list-disc list-inside space-y-1">
                            {requirements.map((item, index) => (
                              <li key={`${event.id}-req-${index}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="space-y-1 text-sm text-slate-500">
                        {event.location && (
                          <p className="font-semibold text-slate-700">
                            Location: <span className="font-normal text-slate-500">{event.location}</span>
                          </p>
                        )}
                        {event.directions && <p>Directions: {event.directions}</p>}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                      {event.is_virtual && event.stream_url && (
                        <a
                          href={event.stream_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[#2D8FDD] px-4 py-2 font-semibold text-[#2D8FDD] transition hover:border-[#1E6BB8]/50 hover:bg-[#2D8FDD]/10"
                        >
                          Join livestream
                        </a>
                      )}
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 font-semibold text-[#2D8FDD]"
                      >
                        Ask about this event
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
