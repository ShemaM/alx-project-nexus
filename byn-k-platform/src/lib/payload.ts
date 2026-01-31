import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Opportunity, Partner, Bookmark } from '@/payload-types'

// Helper to check if an error is a database schema error (missing tables/columns)
const isDatabaseSchemaError = (error: unknown): boolean => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('does not exist') ||
      message.includes('relation') ||
      message.includes('column') ||
      message.includes('failed query')
    )
  }
  return false
}

// Log errors only in development and only for non-schema errors
const logError = (context: string, error: unknown): void => {
  // Skip logging for database schema errors (expected during initial setup)
  if (isDatabaseSchemaError(error)) return
  
  // Log other errors in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Payload] ${context}:`, error)
  }
}

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
    logError('Failed to fetch opportunities', error)
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
    logError(`Failed to fetch latest opportunities (limit: ${limit})`, error)
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
    logError(`Failed to fetch opportunity by ID (id: ${id})`, error)
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
    logError('Failed to fetch opportunity counts', error)
    return {
      jobs: 0,
      scholarships: 0,
      internships: 0,
      fellowships: 0,
      partners: 0,
    }
  }
}

// Get opportunities by category
export const getOpportunitiesByCategory = async (category: string): Promise<Opportunity[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Map frontend category to database category
    const categoryMap: Record<string, string> = {
      'jobs': 'jobs',
      'scholarships': 'scholarships',
      'internships': 'internships',
      'fellowships': 'fellowships',
      'training': 'fellowships', // Map training to fellowships for backward compatibility
    }
    
    const dbCategory = categoryMap[category] || category
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1,
      sort: '-createdAt',
      where: {
        category: { equals: dbCategory },
      },
    })

    return data.docs
  } catch (error) {
    logError(`Failed to fetch opportunities by category (${category})`, error)
    return []
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
    logError(`Failed to fetch user bookmarks (userId: ${userId})`, error)
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
    logError(`Failed to check bookmark status (userId: ${userId}, opportunityId: ${opportunityId})`, error)
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
    logError(`Failed to fetch bookmark (userId: ${userId}, opportunityId: ${opportunityId})`, error)
    return null
  }
}

// Get featured opportunities for hero carousel
export const getFeaturedOpportunities = async (limit: number = 5): Promise<Opportunity[]> => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1,
      sort: '-createdAt',
      limit,
      where: {
        isFeatured: { equals: true },
        isActive: { equals: true },
      },
    })

    return data.docs
  } catch (error) {
    logError(`Failed to fetch featured opportunities (limit: ${limit})`, error)
    return []
  }
}

// ============================================
// Analytics Data Functions
// ============================================

// Get analytics overview for admin dashboard
export const getAnalyticsOverview = async (): Promise<{
  totalOpportunities: number
  activeOpportunities: number
  totalPartners: number
  totalUsers: number
  opportunitiesByCategory: Record<string, number>
  recentActivity: { date: string; count: number }[]
}> => {
  try {
    const payload = await getPayload({ config: configPromise })

    const [
      totalOpportunities,
      activeOpportunities,
      totalPartners,
      totalUsers,
      jobsCount,
      scholarshipsCount,
      internshipsCount,
      fellowshipsCount,
    ] = await Promise.all([
      payload.count({ collection: 'opportunities' }),
      payload.count({ collection: 'opportunities', where: { isActive: { equals: true } } }),
      payload.count({ collection: 'partners' }),
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'opportunities', where: { category: { equals: 'jobs' } } }),
      payload.count({ collection: 'opportunities', where: { category: { equals: 'scholarships' } } }),
      payload.count({ collection: 'opportunities', where: { category: { equals: 'internships' } } }),
      payload.count({ collection: 'opportunities', where: { category: { equals: 'fellowships' } } }),
    ])

    // Get recent opportunities for activity chart (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentOpportunities = await payload.find({
      collection: 'opportunities',
      where: {
        createdAt: { greater_than: sevenDaysAgo.toISOString() },
      },
      limit: 100,
    })

    // Group by date
    const activityMap = new Map<string, number>()
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      activityMap.set(date.toISOString().split('T')[0], 0)
    }

    recentOpportunities.docs.forEach((opp) => {
      const date = new Date(opp.createdAt).toISOString().split('T')[0]
      if (activityMap.has(date)) {
        activityMap.set(date, (activityMap.get(date) || 0) + 1)
      }
    })

    const recentActivity = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))

    return {
      totalOpportunities: totalOpportunities.totalDocs,
      activeOpportunities: activeOpportunities.totalDocs,
      totalPartners: totalPartners.totalDocs,
      totalUsers: totalUsers.totalDocs,
      opportunitiesByCategory: {
        jobs: jobsCount.totalDocs,
        scholarships: scholarshipsCount.totalDocs,
        internships: internshipsCount.totalDocs,
        fellowships: fellowshipsCount.totalDocs,
      },
      recentActivity,
    }
  } catch (error) {
    logError('Failed to fetch analytics overview', error)
    return {
      totalOpportunities: 0,
      activeOpportunities: 0,
      totalPartners: 0,
      totalUsers: 0,
      opportunitiesByCategory: { jobs: 0, scholarships: 0, internships: 0, fellowships: 0 },
      recentActivity: [],
    }
  }
}