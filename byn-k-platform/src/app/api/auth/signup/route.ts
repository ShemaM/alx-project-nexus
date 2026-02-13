import { NextRequest, NextResponse } from 'next/server'

// Base API URL for Django backend
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

// POST /api/auth/signup - Register a new user via Django backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate required fields - ensure they are strings first
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate that email and password are not empty
    // Note: password is not trimmed to allow spaces within passwords, but empty string is rejected
    if (email.trim() === '' || password.length === 0) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format using a simpler, linear-time regex to prevent ReDoS
    // This regex avoids backtracking by not using nested quantifiers
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    // Limit email length to prevent excessive processing
    if (email.length > 254 || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Forward the registration request to Django backend
    const djangoResponse = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        username: email.toLowerCase(),
        password,
        first_name: name?.split(' ')[0] || '',
        last_name: name?.split(' ').slice(1).join(' ') || '',
      }),
    })

    const responseData = await djangoResponse.json()

    if (!djangoResponse.ok) {
      // Handle Django validation errors
      const errorMessage = responseData.detail || 
        responseData.email?.[0] || 
        responseData.username?.[0] || 
        responseData.password?.[0] || 
        'Failed to create account'
      
      return NextResponse.json(
        { error: errorMessage },
        { status: djangoResponse.status }
      )
    }

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: responseData.user || {
        id: responseData.id,
        email: responseData.email,
        username: responseData.username,
      },
    }, { status: 201 })

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

    return response
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
