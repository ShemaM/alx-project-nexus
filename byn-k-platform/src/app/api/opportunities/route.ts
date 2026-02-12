import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

// GET /api/opportunities - Backward-compatible opportunities listing endpoint
export async function GET(request: NextRequest) {
  try {
    const djangoResponse = await fetch(`${API_BASE_URL}/opportunities/${request.nextUrl.search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      cache: 'no-store',
    })

    const responseBody = await djangoResponse.text()
    return new NextResponse(responseBody, {
      status: djangoResponse.status,
      headers: {
        'Content-Type': djangoResponse.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 })
  }
}
