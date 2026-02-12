import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

function expireCookie(response: NextResponse, name: string) {
  response.cookies.set(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

// POST /api/auth/logout - Log out the current user
export async function POST(request: NextRequest) {
  try {
    const nextAuthToken = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })
    const djangoAccessToken = (nextAuthToken as any)?.djangoAccessToken

    // Best effort backend logout to clear Django session/cookies.
    let djangoSetCookie: string | null = null
    try {
      const csrfToken = request.cookies.get('csrftoken')?.value
      const djangoResponse = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: request.headers.get('cookie') || '',
          ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
          ...(djangoAccessToken ? { Authorization: `Bearer ${djangoAccessToken}` } : {}),
        },
        cache: 'no-store',
      })
      djangoSetCookie = djangoResponse.headers.get('set-cookie')
    } catch (backendError) {
      console.error('Django logout request failed:', backendError)
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear known app and backend auth cookies.
    expireCookie(response, 'auth-token')
    expireCookie(response, 'payload-token')
    expireCookie(response, process.env.JWT_AUTH_COOKIE || 'bynk_access')
    expireCookie(response, process.env.JWT_AUTH_REFRESH_COOKIE || 'bynk_refresh')
    expireCookie(response, 'sessionid')
    expireCookie(response, 'csrftoken')

    // Clear NextAuth cookies for both dev and production naming variants.
    expireCookie(response, 'next-auth.session-token')
    expireCookie(response, '__Secure-next-auth.session-token')
    expireCookie(response, 'next-auth.csrf-token')
    expireCookie(response, '__Host-next-auth.csrf-token')
    expireCookie(response, 'next-auth.callback-url')
    expireCookie(response, '__Secure-next-auth.callback-url')

    // Expire all cookies seen on this request to avoid missing custom names.
    const requestCookies = request.cookies.getAll()
    for (const cookie of requestCookies) {
      expireCookie(response, cookie.name)
    }

    if (djangoSetCookie) {
      response.headers.append('set-cookie', djangoSetCookie)
    }

    return response
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    )
  }
}
