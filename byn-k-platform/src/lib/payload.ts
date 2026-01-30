import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Opportunity, Partner, Bookmark } from '@/payload-types'

export const getOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1, // This automatically "joins" the Partner data (Organization Name)
      sort: '-createdAt',
    })

    return data.docs
  } catch (error) {
    console.error('Failed to fetch opportunities:', error)
    return []
  }
}

// Get latest opportunities for sidebar (limited count, sorted by newest)
export const getLatestOpportunities = async (limit: number = 5): Promise<Opportunity[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1,
      sort: '-createdAt',
      limit,
    })

    return data.docs
  } catch (error) {
    console.error('Failed to fetch latest opportunities:', error)
    return []
  }
}

// Get a single opportunity by ID
export const getOpportunityById = async (id: number): Promise<Opportunity | null> => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const data = await payload.findByID({
      collection: 'opportunities',
      id,
      depth: 1,
    })

    return data
  } catch (error) {
    console.error('Failed to fetch opportunity by ID:', error)
    return null
  }
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
  try {
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
  } catch (error) {
    console.error('Failed to fetch opportunity counts:', error)
    return {
      jobs: 0,
      scholarships: 0,
      internships: 0,
      fellowships: 0,
      partners: 0,
    }
  }
}

// Get user's bookmarked opportunities
export const getUserBookmarks = async (userId: number): Promise<Bookmark[]> => {
  try {
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
  } catch (error) {
    console.error('Failed to fetch user bookmarks:', error)
    return []
  }
}

// Check if user has bookmarked a specific opportunity
export const isOpportunityBookmarked = async (
  userId: number,
  opportunityId: number
): Promise<boolean> => {
  try {
    const payload = await getPayload({ config: configPromise })

    const data = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [{ user: { equals: userId } }, { opportunity: { equals: opportunityId } }],
      },
      limit: 1,
    })

    return data.totalDocs > 0
  } catch (error) {
    console.error('Failed to check bookmark status:', error)
    return false
  }
}

// Get bookmark by user and opportunity
export const getBookmark = async (
  userId: number,
  opportunityId: number
): Promise<Bookmark | null> => {
  try {
    const payload = await getPayload({ config: configPromise })

    const data = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [{ user: { equals: userId } }, { opportunity: { equals: opportunityId } }],
      },
      limit: 1,
    })

    return data.docs[0] || null
  } catch (error) {
    console.error('Failed to fetch bookmark:', error)
    return null
  }
}