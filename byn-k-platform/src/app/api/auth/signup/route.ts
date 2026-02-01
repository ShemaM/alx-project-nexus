import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/auth/signup - Register a new user
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

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

    // Check if user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email.toLowerCase() },
      },
      limit: 1,
    })

    if (existingUser.totalDocs > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create the new user
    const user = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
        name: name || null,
        roles: ['user'], // Default role
      },
    })

    // Log the user in after registration
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase(),
        password,
      },
    })

    // Create response with auth token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        roles: user.roles,
      },
    }, { status: 201 })

    // Set the auth token as a cookie
    if (loginResult.token) {
      response.cookies.set('payload-token', loginResult.token, {
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
