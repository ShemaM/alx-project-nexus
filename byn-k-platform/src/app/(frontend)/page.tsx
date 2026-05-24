import LandingHero from '@/components/landing/Hero'
import { StatsBar } from '@/components/landing/StatsBar'
import { CategoryGrid } from '@/components/landing/CategoryGrid'
import { HowItWorks } from '@/components/landing/HowItWorks'
import RecentUpdatesSection from '@/components/landing/RecentUpdates'
import { PartnersMarquee } from '@/components/landing/PartnersMarquee'
import { getCategoryCounts, getEvents, getOpportunities, type CategoryCounts } from '@/lib/api'
import type { Event, Opportunity } from '@/types'

const defaultCounts: CategoryCounts = {
  jobs: 0,
  scholarships: 0,
  internships: 0,
  fellowships: 0,
  training: 0,
  partners: 0,
}

export const revalidate = 60

export default async function HomePage() {
  let counts: CategoryCounts = defaultCounts
  let events: Event[] = []
  let opportunities: Opportunity[] = []
  let fetchError = ''

  try {
    const [countsResponse, eventsResponse, opportunitiesResponse] = await Promise.all([
      getCategoryCounts(),
      getEvents(6),
      getOpportunities({ page_size: 8, ordering: '-created_at', is_verified: true }),
    ])

    counts = countsResponse
    events = eventsResponse.results
    opportunities = opportunitiesResponse.data
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Unable to reach the gateway API.'
    console.error('Failed to load homepage data:', error)
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* 1 — Hero */}
        <LandingHero counts={counts} />

        {/* 2 — Key metrics */}
        <StatsBar counts={counts} />

        {/* 3 — Category grid */}
        <CategoryGrid counts={counts} />

        {/* 4 — How it works */}
        <HowItWorks />

        {/* 5 — Latest verified listings + sidebar */}
        <RecentUpdatesSection
          events={events}
          opportunities={opportunities}
          errorMessage={fetchError}
        />

        {/* 6 — Partner marquee */}
        <PartnersMarquee />
      </main>
    </div>
  )
}
