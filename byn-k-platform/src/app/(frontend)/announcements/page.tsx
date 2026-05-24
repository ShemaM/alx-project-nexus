import React from 'react'
import Link from 'next/link'
import { ArrowRight, Megaphone } from 'lucide-react'
import { getAnnouncements, Announcement } from '@/lib/api'

export const metadata = {
  title: 'Announcements | Banyamulenge Youth Kenya Platform',
  description: 'Latest announcements about jobs, partnerships, and community updates for Banyamulenge youth.',
}

export const revalidate = 60

/** Shows the announcements feed with hero copy, failure states, and email CTA. */
export default async function AnnouncementsPage() {
  let announcements: Announcement[] = []
  let fetchError = false

  // Fetch the latest announcements, but keep the UI friendly when the API is unreachable.
  try {
    const response = await getAnnouncements(10)
    announcements = response.results || []
  } catch (error) {
    console.error('Error fetching announcements page data:', error)
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-hero-dark via-primary-dark to-primary py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border-on-dark/70 bg-glass-on-dark">
            <Megaphone className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-on-dark">Announcements</h1>
          <p className="mt-4 text-lg text-muted-on-dark">
            Stay in the loop with the newest opportunity drops, system notices, and community updates.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
          {fetchError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Unable to load announcements right now. Please refresh or try again later.
            </div>
          )}

          {announcements.length === 0 && !fetchError ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              No announcements published yet. Check back soon for verified updates.
            </div>
          ) : (
            announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-lg px-6 py-8"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
                  <span>Update</span>
                  {announcement.published_at && (
                    <span>
                      {new Date(announcement.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">{announcement.title}</h2>
                {announcement.summary && (
                  <p className="mt-3 text-sm text-slate-600">{announcement.summary}</p>
                )}
                <Link
                  href={`mailto:info@banyamulenge.youth?subject=${encodeURIComponent(
                    announcement.title
                  )}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-500"
                >
                  Contact us <ArrowRight size={14} />
                </Link>
              </article>
            ))
          )}
        </div>
      </section>

    </div>
  )
}
