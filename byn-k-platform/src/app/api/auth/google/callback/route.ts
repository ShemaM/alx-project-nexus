import { NextRequest, NextResponse } from 'next/server'

interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  id_token: string
  refresh_token?: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name?: string
  family_name?: string
  picture?: string
}

// Base API URL for Django backend
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

// GET /api/auth/google/callback - Handle Google OAuth callback
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle error from Google
    if (error) {
      // Sanitize user-controlled error parameter to prevent log injection
      const sanitizedError = String(error).replace(/[\r\n\t]/g, '').slice(0, 100)
      console.error('Google OAuth error:', sanitizedError)
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // Parse state to get redirect URL
    let redirectUrl = '/'
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
        redirectUrl = stateData.redirect || '/'
      } catch {
        // Invalid state, use default redirect
      }
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL('/login?error=oauth_not_configured', request.url))
    }

    // Build the callback URL (must match the one used in initial redirect)
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const callbackUrl = `${protocol}://${host}/api/auth/google/callback`

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to get user info:', await userInfoResponse.text())
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url))
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url))
    }

    // Send Google user info to Django backend for authentication/registration
    const djangoAuthResponse = await fetch(`${API_BASE_URL}/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || '',
        google_id: googleUser.id,
        picture: googleUser.picture || null,
      }),
    })

    if (!djangoAuthResponse.ok) {
      // If Django doesn't have Google OAuth endpoint, redirect to login with a message
      console.error('Django auth failed:', await djangoAuthResponse.text())
      return NextResponse.redirect(new URL('/login?error=google_not_supported&message=Please use email/password to login', request.url))
    }

    // Get session/token from Django response
    const authData = await djangoAuthResponse.json()

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))

    // If Django returns a session token, set it as a cookie
    if (authData.token) {
      response.cookies.set('auth-token', authData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return response
  } catch (error) {
    console.error('Error in Google OAuth callback:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}
