import { NextRequest, NextResponse } from 'next/server'

// Base API URL for Django backend
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

async function resolveAuthContext(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value
  if (authToken) {
    return { authenticated: true, authToken }
  }

  const cookieHeader = request.headers.get('cookie') || ''
  if (!cookieHeader) {
    return { authenticated: false, authToken: undefined as string | undefined }
  }

  try {
    const meResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    return {
      authenticated: meResponse.ok,
      authToken: undefined as string | undefined,
    }
  } catch {
    return { authenticated: false, authToken: undefined as string | undefined }
  }
}

// GET /api/bookmarks - List user's bookmarks
// Note: Bookmarks feature is not yet implemented in Django backend
export async function GET(request: NextRequest) {
  try {
    const { authenticated, authToken } = await resolveAuthContext(request)

    if (!authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Try to get bookmarks from Django backend
    try {
      const djangoResponse = await fetch(`${API_BASE_URL}/bookmarks/`, {
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          cookie: request.headers.get('cookie') || '',
        },
      })

      if (djangoResponse.ok) {
        const data = await djangoResponse.json()
        return NextResponse.json({
          success: true,
          bookmarks: data.results || data.bookmarks || [],
          totalDocs: data.count || data.total || 0,
        })
      }
    } catch {
      // Bookmarks endpoint may not exist yet
    }

    // Default response if bookmarks not implemented
    return NextResponse.json({
      success: true,
      bookmarks: [],
      totalDocs: 0,
      message: 'Bookmarks feature coming soon',
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
    const { authenticated, authToken } = await resolveAuthContext(request)

    if (!authenticated) {
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

    // Try to create bookmark via Django backend
    try {
      const djangoResponse = await fetch(`${API_BASE_URL}/bookmarks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          cookie: request.headers.get('cookie') || '',
        },
        body: JSON.stringify({
          opportunity_id: opportunityId,
          notes: notes || null,
        }),
      })

      if (djangoResponse.ok) {
        const bookmark = await djangoResponse.json()
        return NextResponse.json({
          success: true,
          bookmark,
        }, { status: 201 })
      }

      if (djangoResponse.status === 409) {
        return NextResponse.json(
          { error: 'Opportunity already bookmarked' },
          { status: 409 }
        )
      }
    } catch {
      // Bookmarks endpoint may not exist yet
    }

    // Default response if bookmarks not implemented
    return NextResponse.json(
      { error: 'Bookmarks feature coming soon' },
      { status: 501 }
    )
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
    const { authenticated, authToken } = await resolveAuthContext(request)

    if (!authenticated) {
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

    const opportunityIdNum = Number(opportunityId)
    if (isNaN(opportunityIdNum)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      )
    }

    // Try to delete bookmark via Django backend
    try {
      const djangoResponse = await fetch(
        `${API_BASE_URL}/bookmarks/?opportunity_id=${opportunityIdNum}`,
        {
          method: 'DELETE',
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            cookie: request.headers.get('cookie') || '',
          },
        }
      )

      if (djangoResponse.ok) {
        return NextResponse.json({
          success: true,
          message: 'Bookmark removed',
        })
      }

      if (djangoResponse.status === 404) {
        return NextResponse.json(
          { error: 'Bookmark not found' },
          { status: 404 }
        )
      }
    } catch {
      // Bookmarks endpoint may not exist yet
    }

    // Default response if bookmarks not implemented
    return NextResponse.json(
      { error: 'Bookmarks feature coming soon' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
