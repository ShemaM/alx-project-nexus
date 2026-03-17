import Link from 'next/link'
import type { CategoryCounts } from '@/lib/api'

// Metrics that appear inside the hero card to show opportunity counts.
const heroMetrics = [
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'internships', label: 'Internships' },
  { key: 'training', label: 'Trainings' },
  { key: 'fellowships', label: 'Fellowships' },
  { key: 'jobs', label: 'Jobs & placements' },
]

interface LandingHeroProps {
  counts: CategoryCounts
}


// Displays hero copy with CTA buttons and refreshed category metrics.
export function LandingHero({ counts }: LandingHeroProps) {
  const formattedMetrics = heroMetrics.map((metric) => ({
    label: metric.label,
    value: counts[metric.key as keyof CategoryCounts],
  }))

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-[#091336] via-[#0f2a5e] to-[#2D8FDD] px-6 py-16 text-white shadow-xl">
      <div className="absolute -right-32 top-6 h-52 w-52 rounded-full bg-[#F5D300]/20 blur-3xl" />
      <div className="absolute -left-24 top-0 h-48 w-48 rounded-full bg-[#D52B2B]/20 blur-3xl" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.6em] text-white/70">Banyamulenge Youth Kenya</p>
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Welcome home, Banyamulenge youth—your next opportunity is already queued here.
          </h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            We guide you through verified scholarships, internships, trainings, and in-person conferences with trusted partners, so every scroll leads to a confident step forward.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center justify-center rounded-full bg-[#F5D300] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#091336] transition hover:bg-[#ffe533]"
            >
              Explore opportunities
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full bg-[#F5D300] px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#091336] transition hover:bg-[#ffe533]"
            >
              Upcoming events
            </Link>
          </div>
          
        </div>

        <div className="w-full rounded-4xl border border-white/30 bg-white/10 p-6 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Opportunity pulse</p>
          <div className="mt-4 space-y-4">
            {formattedMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3"
              >
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-white/60">{metric.label}</p>
                <p className="text-lg font-black text-white">{metric.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/60">
            Numbers refresh daily as we verify new partners and share fresh openings for Banyamulenge youth.
          </p>
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#F5D300] bg-[#F5D300]/10 px-4 py-3 text-sm font-semibold text-[#1C1B18]">
            <span>Events and Opportunities verified per week</span>
            <span className="rounded-full bg-[#F5D300] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#091336]">
              Verified
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
