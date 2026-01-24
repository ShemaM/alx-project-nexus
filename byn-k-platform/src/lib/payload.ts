import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Opportunity, Partner } from '@/payload-types'

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