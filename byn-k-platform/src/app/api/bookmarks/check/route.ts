import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/bookmarks/check?opportunityId=123 - Check if opportunity is bookmarked
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get user from session
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({
        isBookmarked: false,
        authenticated: false,
      })
    }

    const { searchParams } = new URL(request.url)
    const opportunityId = searchParams.get('opportunityId')

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Opportunity ID is required' },
        { status: 400 }
      )
    }

    const opportunityIdNum = Number(opportunityId)
    if (isNaN(opportunityIdNum)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      )
    }

    const existing = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [
          { user: { equals: user.id } },
          { opportunity: { equals: opportunityIdNum } },
        ],
      },
      limit: 1,
    })

    return NextResponse.json({
      isBookmarked: existing.totalDocs > 0,
      authenticated: true,
      bookmarkId: existing.docs[0]?.id || null,
    })
  } catch (error) {
    console.error('Error checking bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    )
  }
}
