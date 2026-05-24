import Link from 'next/link'
import { ArrowRight, FileCheck2, Search } from 'lucide-react'
import type { CategoryCounts } from '@/lib/api'

const categoryLinks = [
  { key: 'jobs', label: 'Jobs', href: '/opportunities?category=job' },
  { key: 'scholarships', label: 'Scholarships', href: '/opportunities?category=scholarship' },
  { key: 'internships', label: 'Internships', href: '/opportunities?category=internship' },
  { key: 'training', label: 'Training', href: '/opportunities?category=training' },
  { key: 'fellowships', label: 'Fellowships', href: '/opportunities?category=fellowship' },
] as const

const documentLinks = [
  { label: 'Refugee ID', href: '/opportunities?docs=refugee_id' },
  { label: 'CTD', href: '/opportunities?docs=ctd' },
  { label: 'Proof of Registration', href: '/opportunities?docs=proof_of_registration' },
  { label: 'Mandate Letter', href: '/opportunities?docs=mandate' },
  { label: 'Alien Card', href: '/opportunities?docs=alien_card' },
]

interface LandingHeroProps {
  counts: CategoryCounts
}

export function LandingHero({ counts }: LandingHeroProps) {
  return (
    <section className="grid lg:grid-cols-2">

      {/* ── LEFT PANEL: Navy ── */}
      <div className="relative overflow-hidden bg-navy px-8 py-16 lg:px-12 lg:py-20">
        {/* Grid overlay */}
        <div className="byn-grid pointer-events-none absolute inset-0 opacity-60" />
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-0 h-60 w-60 rounded-full bg-secondary/8 blur-3xl" />

        <div className="relative z-10 max-w-xl">
          {/* Kicker */}
          <div className="mb-7 border-l-[3px] border-secondary pl-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
              Banyamulenge Youth Kenya
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-syne mb-6 text-[46px] font-extrabold leading-[1.08] tracking-[-1.5px] text-on-dark md:text-[52px]">
            Open to you —{' '}
            <span className="text-secondary">whatever</span>
            <br />
            <span className="text-secondary">document</span>{' '}
            <span className="text-primary-light">you hold.</span>
          </h1>

          <p className="mb-8 max-w-md text-[15.5px] leading-[1.75] text-muted-on-dark">
            Jobs, scholarships, internships and training from NGOs, private
            employers, foundations and schools — every listing verified and
            matched to your exact papers, whether Refugee ID, CTD, Mandate
            Letter, Alien Card, or any document you carry.
          </p>

          {/* Search bar */}
          <form
            action="/opportunities"
            className="mb-5 grid gap-1.5 rounded-xl border border-border-on-dark/60 bg-glass-on-dark p-1.5 backdrop-blur-sm sm:grid-cols-[1fr_auto]"
          >
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-muted-on-dark/70" />
              <span className="sr-only">Search opportunities</span>
              <input
                name="search"
                type="search"
                placeholder="Search jobs, scholarships, trainings..."
                className="h-12 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-on-dark placeholder:text-muted-on-dark/50 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="byn-button-primary inline-flex items-center gap-2 rounded-lg px-6 text-sm font-bold"
            >
              Search <ArrowRight size={15} />
            </button>
          </form>

          {/* Doc chips */}
          <div className="space-y-2.5">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-on-dark/70">
              <FileCheck2 size={14} className="text-secondary" />
              Filter by your document
            </p>
            <div className="flex flex-wrap gap-2">
              {documentLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-border-on-dark/50 bg-glass-on-dark px-4 py-1.5 text-[12px] font-semibold text-muted-on-dark backdrop-blur-sm transition hover:border-secondary/60 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Warm cream (softened gold) ── */}
      <div className="relative overflow-hidden bg-[#fffbeb] px-8 py-16 lg:px-10 lg:py-20">
        {/* Subtle gold glow top-right */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative z-10">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-navy/55">
            Browse by category
          </p>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-syne text-xl font-extrabold leading-tight text-navy">
              Opportunity Board
            </h2>
            <Link
              href="/opportunities"
              className="text-xs font-bold text-navy/65 transition hover:text-navy"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2.5">
            {categoryLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group flex items-center justify-between rounded-xl border border-navy/12 bg-navy/[0.07] px-4 py-3.5 transition hover:border-navy hover:bg-navy"
              >
                <span className="font-syne text-sm font-bold text-navy transition group-hover:text-white">
                  {item.label}
                </span>
                <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-extrabold text-secondary transition group-hover:bg-secondary group-hover:text-navy">
                  {counts[item.key].toLocaleString()}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-navy/15 bg-navy/[0.07] p-4 text-[12.5px] leading-[1.65] text-navy/70">
            We flag opportunities from trusted refugee-serving partners and note
            when applications accept refugee documentation.
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
