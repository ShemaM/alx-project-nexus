import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export const getOpportunities = async () => {
  const payload = await getPayload({ config: configPromise })
  
  const data = await payload.find({
    collection: 'opportunities',
    depth: 1, // This automatically "joins" the Partner data (Organization Name)
    sort: '-createdAt',
  })

  return data.docs
}