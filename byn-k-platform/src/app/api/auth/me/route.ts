import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

// GET /api/auth/me - Backward-compatible current-user endpoint
export async function GET(request: NextRequest) {
  try {
    const nextAuthToken = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })
    const djangoAccessToken = (nextAuthToken as any)?.djangoAccessToken

    const djangoResponse = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
        ...(djangoAccessToken ? { Authorization: `Bearer ${djangoAccessToken}` } : {}),
      },
      cache: 'no-store',
    })

    const setCookieHeader = djangoResponse.headers.get('set-cookie')
    const responseBody = await djangoResponse.text()
    const response = new NextResponse(responseBody, {
      status: djangoResponse.status,
      headers: {
        'Content-Type': djangoResponse.headers.get('content-type') || 'application/json',
      },
    })

    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }

    return response
  } catch (error) {
    console.error('Error fetching current user:', error)
    return NextResponse.json({ error: 'Failed to fetch current user' }, { status: 500 })
  }
}
