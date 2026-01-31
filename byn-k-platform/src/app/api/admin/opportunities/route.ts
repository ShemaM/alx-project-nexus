/**
 * Opportunities List API Route
 * 
 * Provides paginated list of opportunities with filtering for admin management.
 * 
 * @module api/admin/opportunities
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
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
    interface WhereClause {
      or?: Array<{ title: { contains: string } } | { 'organization.name': { contains: string } }>
      category?: { equals: string }
      isActive?: { equals: boolean }
      isVerified?: { equals: boolean }
      isFeatured?: { equals: boolean }
    }
    
    const where: WhereClause = {}
    
    if (search) {
      where.or = [
        { title: { contains: search } },
        { 'organization.name': { contains: search } },
      ]
    }
    
    if (category) {
      where.category = { equals: category }
    }
    
    if (isActive) {
      where.isActive = { equals: isActive === 'true' }
    }
    
    if (isVerified) {
      where.isVerified = { equals: isVerified === 'true' }
    }
    
    if (isFeatured) {
      where.isFeatured = { equals: isFeatured === 'true' }
    }
    
    const data = await payload.find({
      collection: 'opportunities',
      depth: 1,
      page,
      limit,
      sort: '-createdAt',
      where: Object.keys(where).length > 0 ? where : undefined,
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
