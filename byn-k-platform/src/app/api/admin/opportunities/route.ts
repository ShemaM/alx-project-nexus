/**
 * Opportunities List API Route
 * 
 * Provides paginated list of opportunities with filtering for admin management.
 * 
 * @module api/admin/opportunities
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import configPromise from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const isVerified = searchParams.get('isVerified')
    const isFeatured = searchParams.get('isFeatured')
    
    // Build where clause
    const conditions: Where[] = []
    
    if (search) {
      conditions.push({
        or: [
          { title: { contains: search } },
        ]
      })
    }
    
    if (category) {
      conditions.push({ category: { equals: category } })
    }
    
    if (isActive) {
      conditions.push({ isActive: { equals: isActive === 'true' } })
    }
    
    if (isVerified) {
      conditions.push({ isVerified: { equals: isVerified === 'true' } })
    }
    
    if (isFeatured) {
      conditions.push({ isFeatured: { equals: isFeatured === 'true' } })
    }
    
    const where: Where | undefined = conditions.length > 0 
      ? conditions.length === 1 
        ? conditions[0] 
        : { and: conditions }
      : undefined
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1,
      page,
      limit,
      sort: '-createdAt',
      where,
    })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch opportunities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    )
  }
}
