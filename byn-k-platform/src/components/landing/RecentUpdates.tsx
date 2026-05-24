'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { CalendarDays, ExternalLink, FileText, Link2, ShieldCheck } from 'lucide-react'
import type { DocumentType, Event, Opportunity } from '@/types'
import { buildOpportunityPath } from '@/lib/opportunity-utils'

interface RecentUpdatesProps {
  events: Event[]
  opportunities: Opportunity[]
  errorMessage?: string
}

const trustedSources = [
  'Amahoro Coalition',
  'Refugee Consortium of Kenya',
  'HIAS Kenya',
  'Jesuit Refugee Service',
  'Danish Refugee Council',
  'Department of Refugee Services',
]

const documentLabels: Partial<Record<DocumentType, string>> = {
  refugee_id: 'Refugee ID',
  ctd: 'CTD',
  proof_of_registration: 'Proof of Registration',
  mandate: 'Mandate Letter',
  alien_card: 'Alien Card',
  waiting_slip: 'Waiting Slip',
  any_id: 'Any ID',
}

const documentFilters = [
  { label: 'Refugee ID', value: 'refugee_id' },
  { label: 'CTD', value: 'ctd' },
  { label: 'Proof of Registration', value: 'proof_of_registration' },
  { label: 'Mandate Letter', value: 'mandate' },
  { label: 'Alien Card', value: 'alien_card' },
  { label: 'Any ID', value: 'any_id' },
]

const categoryLabels: Record<string, string> = {
  job: 'Job',
  scholarship: 'Scholarship',
  internship: 'Internship',
  fellowship: 'Fellowship',
  training: 'Training',
}

const categoryColors: Record<string, string> = {
  job: 'bg-secondary/20 text-yellow-800 border-secondary/40',
  scholarship: 'bg-primary/10 text-primary-dark border-primary/25',
  internship: 'bg-primary/8 text-primary-dark border-primary/20',
  fellowship: 'bg-navy/8 text-navy border-navy/20',
  training: 'bg-accent/8 text-accent-dark border-accent/20',
}

const fuzzyMatch = (source: string | undefined | null, query: string) =>
  typeof source === 'string' && source.toLowerCase().includes(query)

const formatDeadline = (value?: string | null) => {
  if (!value) return 'Rolling or not stated'
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const getDocumentText = (documents: DocumentType[] | undefined) => {
  if (!documents || documents.length === 0) return 'Documentation not specified'
  return documents
    .slice(0, 3)
    .map((doc) => documentLabels[doc] || doc.replaceAll('_', ' '))
    .join(', ')
}

export function RecentUpdatesSection({ events, opportunities, errorMessage }: RecentUpdatesProps) {
  const [search, setSearch] = useState('')
  const [document, setDocument] = useState('')
  const normalizedSearch = search.trim().toLowerCase()

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesSearch =
        !normalizedSearch ||
        fuzzyMatch(opportunity.title, normalizedSearch) ||
        fuzzyMatch(opportunity.organization_name, normalizedSearch) ||
        fuzzyMatch(opportunity.description_en, normalizedSearch) ||
        fuzzyMatch(opportunity.location, normalizedSearch)

      const matchesDocument =
        !document || opportunity.required_documents?.includes(document as DocumentType)

      return matchesSearch && matchesDocument
    })
  }, [document, normalizedSearch, opportunities])

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_320px]">

        {/* ── Main column ── */}
        <div className="space-y-6">

          {/* Filter bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                  Search the board
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by role, NGO, city, training, scholarship..."
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                  Accepted document
                </span>
                <select
                  value={document}
                  onChange={(event) => setDocument(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="">Any document</option>
                  {documentFilters.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Section heading */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="byn-kicker">Latest from the board</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                Verified jobs, trainings &amp; scholarships
              </h2>
            </div>
            <Link
              href="/opportunities?is_verified=true"
              className="text-sm font-bold text-primary transition hover:underline"
            >
              Browse all verified →
            </Link>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage} Please refresh or check back soon.
            </div>
          )}

          {/* Opportunity cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity) => {
                const catColor = categoryColors[opportunity.category || 'job'] || 'bg-slate-100 text-slate-700 border-slate-200'
                return (
                  <article
                    key={opportunity.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${catColor}`}>
                        {categoryLabels[opportunity.category || 'job'] || 'Opportunity'}
                      </span>
                      {opportunity.is_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <ShieldCheck size={12} />
                          Verified
                        </span>
                      )}
                      {opportunity.brochure_url ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-bold text-slate-800">
                          <FileText size={12} />
                          Brochure
                        </span>
                      ) : opportunity.external_url ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          <Link2 size={12} />
                          Link
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-base font-black leading-snug text-slate-900 transition group-hover:text-primary">
                      {opportunity.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {opportunity.organization_name}
                    </p>

                    <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                      <p>
                        <span className="font-bold text-slate-800">Documents:</span>{' '}
                        {getDocumentText(opportunity.required_documents)}
                      </p>
                      <p>
                        <span className="font-bold text-slate-800">Deadline:</span>{' '}
                        {formatDeadline(opportunity.deadline)}
                      </p>
                    </div>

                    <Link
                      href={buildOpportunityPath(opportunity.category || 'job', opportunity.slug)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
                    >
                      View details
                      <ExternalLink size={14} />
                    </Link>
                  </article>
                )
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                No matching opportunities. Try another document filter or{' '}
                <Link href="/opportunities" className="font-bold text-primary hover:underline">
                  browse all opportunities
                </Link>
                .
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">

          {/* Trusted partners */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="byn-kicker mb-2">Trusted source lanes</p>
            <h2 className="text-lg font-black text-slate-900">Refugee-serving partners we prioritize</h2>
            <div className="mt-4 grid gap-2">
              {trustedSources.map((source) => (
                <Link
                  key={source}
                  href={`/opportunities?search=${encodeURIComponent(source)}`}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  {source}
                </Link>
              ))}
            </div>
          </div>

          {/* Community intake CTA */}
          <div className="rounded-2xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5 p-5">
            <p className="byn-kicker mb-2">Community intake</p>
            <h2 className="text-lg font-black text-slate-900">Links and brochures are welcome</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Many opportunities arrive from WhatsApp and community groups as a bare link or PDF.
              We turn them into searchable cards, add document notes, and verify the source before listing.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Share an opportunity
            </Link>
          </div>

          {/* Upcoming events */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" />
              <h2 className="text-lg font-black text-slate-900">Upcoming sessions</h2>
            </div>
            <div className="space-y-2.5">
              {events.length > 0 ? (
                events.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href="/events"
                    className="block rounded-xl border border-slate-200 p-3 transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <p className="text-sm font-bold text-slate-900">{event.title}</p>
                    {event.partner && (
                      <p className="mt-1 text-xs text-slate-500">{event.partner}</p>
                    )}
                  </Link>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  New webinars and community sessions will appear here once verified.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default RecentUpdatesSection
