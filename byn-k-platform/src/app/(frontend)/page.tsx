import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LandingHero from '@/components/landing/Hero'
import RecentUpdatesSection from '@/components/landing/RecentUpdates'
import { getCategoryCounts, getEvents, getOpportunities, type CategoryCounts } from '@/lib/api'
import type { Event, Opportunity } from '@/types'

/** Landing page that combines hero metrics with the latest events and update explorer. */
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
  let opportunityPreviews: Opportunity[] = []
  let fetchError = ''

  // Attempt to load counts, events, and a few opportunities for the hero + updates components.
  try {
    const [countsResponse, eventsResponse] = await Promise.all([
      getCategoryCounts(),
      getEvents(6),
      getOpportunities({ page_size: 3, ordering: '-created_at' }),
    ])

    counts = countsResponse
    events = eventsResponse.results
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Unable to reach the gateway API.'
    console.error('Failed to load homepage data:', error)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 space-y-10">
        <LandingHero counts={counts} />
        <RecentUpdatesSection events={events} errorMessage={fetchError} />
      </main>
      <Footer />
    </div>
  )
}
