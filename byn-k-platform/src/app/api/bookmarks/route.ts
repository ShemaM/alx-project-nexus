import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/bookmarks - List user's bookmarks
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get user from session/headers (Payload handles this via cookies)
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const bookmarks = await payload.find({
      collection: 'bookmarks',
      where: {
        user: { equals: user.id },
      },
      depth: 2, // Include opportunity and organization details
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks.docs,
      totalDocs: bookmarks.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get user from session
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { opportunityId, notes } = body

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Opportunity ID is required' },
        { status: 400 }
      )
    }

    // Check if opportunity exists
    const opportunity = await payload.findByID({
      collection: 'opportunities',
      id: opportunityId,
    })

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    // Check if already bookmarked
    const existing = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [
          { user: { equals: user.id } },
          { opportunity: { equals: opportunityId } },
        ],
      },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return NextResponse.json(
        { error: 'Opportunity already bookmarked' },
        { status: 409 }
      )
    }

    // Create bookmark
    const bookmark = await payload.create({
      collection: 'bookmarks',
      data: {
        user: user.id,
        opportunity: opportunityId,
        notes: notes || null,
      },
    })

    return NextResponse.json({
      success: true,
      bookmark,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get user from session
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const opportunityId = searchParams.get('opportunityId')

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Opportunity ID is required' },
        { status: 400 }
      )
    }

    // Find and delete the bookmark
    const existing = await payload.find({
      collection: 'bookmarks',
      where: {
        and: [
          { user: { equals: user.id } },
          { opportunity: { equals: Number(opportunityId) } },
        ],
      },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    await payload.delete({
      collection: 'bookmarks',
      id: existing.docs[0].id,
    })

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed',
    })
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
