import type { CategoryCounts } from '@/lib/api'

interface StatsBarProps {
  counts: CategoryCounts
}

export function StatsBar({ counts }: StatsBarProps) {
  const total = counts.jobs + counts.scholarships + counts.internships + counts.fellowships + counts.training

  const stats = [
    { value: total > 0 ? `${total.toLocaleString()}+` : '1,200+', label: 'Opportunities' },
    { value: counts.partners > 0 ? `${counts.partners.toLocaleString()}+` : '50+', label: 'Trusted Partners' },
    { value: '5', label: 'Categories' },
    { value: '100%', label: 'Free to Use' },
  ]

  return (
    <div className="relative overflow-hidden bg-accent">
      {/* Tricolor shimmer line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary via-primary to-secondary" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 divide-x divide-white/20 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5 px-4 py-7">
              <dd className="font-syne text-[38px] font-extrabold leading-none text-white">
                {stat.value}
              </dd>
              <dt className="text-[11.5px] font-medium tracking-[0.04em] text-white/70">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default StatsBar
