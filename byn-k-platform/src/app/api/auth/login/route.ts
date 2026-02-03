import { NextRequest, NextResponse } from 'next/server'

// Base API URL for Django backend
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

// POST /api/auth/login - Log in a user via Django backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Forward the login request to Django backend
    const djangoResponse = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.toLowerCase(),
        password,
      }),
    })

    const responseData = await djangoResponse.json()

    if (!djangoResponse.ok) {
      return NextResponse.json(
        { error: responseData.detail || 'Invalid email or password' },
        { status: djangoResponse.status }
      )
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: responseData.user || {
        id: responseData.id,
        email: responseData.email,
        username: responseData.username,
        is_admin: responseData.is_admin,
        is_staff: responseData.is_staff,
      },
    })

    // Set auth token cookie if returned by Django
    if (responseData.token) {
      response.cookies.set('auth-token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Forward any cookies from Django response
    const setCookieHeader = djangoResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader)
    }

    return response
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}
