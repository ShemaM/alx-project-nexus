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

// GET /api/bookmarks/check?opportunityId=123 - Check if opportunity is bookmarked
// Note: Bookmarks feature is not yet implemented in Django backend
export async function GET(request: NextRequest) {
  try {
    const { authenticated, authToken } = await resolveAuthContext(request)

    if (!authenticated) {
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

    // Try to check bookmark status via Django backend
    try {
      const djangoResponse = await fetch(
        `${API_BASE_URL}/bookmarks/check/?opportunity_id=${opportunityIdNum}`,
        {
          headers: {
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            cookie: request.headers.get('cookie') || '',
          },
        }
      )

      if (djangoResponse.ok) {
        const data = await djangoResponse.json()
        return NextResponse.json({
          isBookmarked: data.is_bookmarked || false,
          authenticated: true,
          bookmarkId: data.bookmark_id || null,
        })
      }
    } catch {
      // Bookmarks endpoint may not exist yet in Django
    }

    // Default response if bookmarks not implemented
    return NextResponse.json({
      isBookmarked: false,
      authenticated: true,
      bookmarkId: null,
      message: 'Bookmarks feature coming soon',
    })
  } catch (error) {
    console.error('Error checking bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to check bookmark status' },
      { status: 500 }
    )
  }
}
