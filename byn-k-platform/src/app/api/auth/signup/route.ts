import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendWelcomeEmail } from '@/lib/email'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bynk-dev-secret')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Register with Django backend
    const djangoResponse = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      const errorMessage =
        responseData.detail ||
        responseData.email?.[0] ||
        responseData.username?.[0] ||
        responseData.password?.[0] ||
        'Failed to create account'
      return NextResponse.json({ error: errorMessage }, { status: djangoResponse.status })
    }

    // Build and send welcome + verification email (non-blocking — don't fail signup if email fails)
    const verificationToken = await new SignJWT({
      email: email.toLowerCase(),
      purpose: 'email_verification',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(SECRET)

    const verificationUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(verificationToken)}`

    sendWelcomeEmail({ to: email, name: name || '', verificationUrl }).catch((err) =>
      console.error('[signup] Failed to send welcome email:', err),
    )

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: responseData.user || {
          id: responseData.id,
          email: responseData.email,
          username: responseData.username,
        },
      },
      { status: 201 },
    )

    // Set auth-token cookie if Django returned one
    if (responseData.token) {
      response.cookies.set('auth-token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return response
  } catch (error) {
    console.error('[signup]', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
