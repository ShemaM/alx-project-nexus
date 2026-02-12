import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, access_token, code } = body || {}

    if (!provider) {
      return NextResponse.json({ error: 'provider is required' }, { status: 400 })
    }

    if (!access_token && !code) {
      return NextResponse.json({ error: 'access_token or code is required' }, { status: 400 })
    }

    const djangoResponse = await fetch(`${API_BASE_URL}/auth/social/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ provider, access_token, code }),
    })

    const payload = await djangoResponse.text()
    const response = new NextResponse(payload, {
      status: djangoResponse.status,
      headers: {
        'Content-Type': djangoResponse.headers.get('content-type') || 'application/json',
      },
    })

    const setCookieHeader = djangoResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }

    return response
  } catch (error) {
    console.error('Social auth proxy error:', error)
    return NextResponse.json({ error: 'Failed social authentication' }, { status: 500 })
  }
}
