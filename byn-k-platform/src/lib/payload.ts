import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Opportunity, Partner, Bookmark } from '@/payload-types'

export const getOpportunities = async () => {
  const payload = await getPayload({ config: configPromise })
  
  const data = await payload.find({
    collection: 'opportunities',
    depth: 1, // This automatically "joins" the Partner data (Organization Name)
    sort: '-createdAt',
  })

  return data.docs
}

// Get latest opportunities for sidebar (limited count, sorted by newest)
export const getLatestOpportunities = async (limit: number = 5) => {
  const payload = await getPayload({ config: configPromise })
  
  const data = await payload.find({
    collection: 'opportunities',
    depth: 1,
    sort: '-createdAt',
    limit,
  })

  return data.docs
}

// Get a single opportunity by ID
export const getOpportunityById = async (id: number) => {
  const payload = await getPayload({ config: configPromise })
  
  const data = await payload.findByID({
    collection: 'opportunities',
    id,
    depth: 1,
  })

  return data
}

// Helper to extract organization name from opportunity
export const getOrganizationName = (opportunity: Opportunity): string => {
  if (typeof opportunity.organization === 'object' && opportunity.organization !== null) {
    return (opportunity.organization as Partner).name
  }
  return 'Unknown Organization'
}

// Map Payload category values to display-friendly format
export const mapCategoryForDisplay = (category: Opportunity['category']): string => {
  const categoryMap: Record<Opportunity['category'], string> = {
    jobs: 'job',
    internships: 'internship',
    scholarships: 'scholarship',
    fellowships: 'fellowship',
  }
  return categoryMap[category] || category
}

// Get count of opportunities by category
export const getOpportunityCounts = async (): Promise<{
  jobs: number
  scholarships: number
  internships: number
  fellowships: number
  partners: number
}> => {
  const payload = await getPayload({ config: configPromise })

  // Count opportunities by category
  const [jobsData, scholarshipsData, internshipsData, fellowshipsData, partnersData] =
    await Promise.all([
      payload.count({
        collection: 'opportunities',
        where: { category: { equals: 'jobs' } },
      }),
      payload.count({
        collection: 'opportunities',
        where: { category: { equals: 'scholarships' } },
      }),
      payload.count({
        collection: 'opportunities',
        where: { category: { equals: 'internships' } },
      }),
      payload.count({
        collection: 'opportunities',
        where: { category: { equals: 'fellowships' } },
      }),
      payload.count({
        collection: 'partners',
      }),
    ])

  return {
    jobs: jobsData.totalDocs,
    scholarships: scholarshipsData.totalDocs,
    internships: internshipsData.totalDocs,
    fellowships: fellowshipsData.totalDocs,
    partners: partnersData.totalDocs,
  }
}

// Get user's bookmarked opportunities
export const getUserBookmarks = async (userId: number) => {
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'bookmarks',
    where: {
      user: { equals: userId },
    },
    depth: 2, // Include opportunity details
    sort: '-createdAt',
  })

  return data.docs
}

// Check if user has bookmarked a specific opportunity
export const isOpportunityBookmarked = async (
  userId: number,
  opportunityId: number
): Promise<boolean> => {
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'bookmarks',
    where: {
      and: [{ user: { equals: userId } }, { opportunity: { equals: opportunityId } }],
    },
    limit: 1,
  })

  return data.totalDocs > 0
}

// Get bookmark by user and opportunity
export const getBookmark = async (
  userId: number,
  opportunityId: number
): Promise<Bookmark | null> => {
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'bookmarks',
    where: {
      and: [{ user: { equals: userId } }, { opportunity: { equals: opportunityId } }],
    },
    limit: 1,
  })

  return data.docs[0] || null
}