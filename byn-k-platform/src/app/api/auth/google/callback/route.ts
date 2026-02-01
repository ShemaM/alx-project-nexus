import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@/payload-types'

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

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: { equals: googleUser.email.toLowerCase() },
      },
      limit: 1,
    })

    let user: User

    if (existingUsers.totalDocs > 0) {
      // User exists, update their info if needed
      user = existingUsers.docs[0]
      
      // Update name if not set
      if (!user.name && googleUser.name) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            name: googleUser.name,
          },
        })
      }
    } else {
      // Create new user
      // Generate a cryptographically secure random password for Google users
      // They won't use it since they'll sign in with Google
      const randomBytes = new Uint8Array(64)
      crypto.getRandomValues(randomBytes)
      const randomPassword = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('')
      
      user = await payload.create({
        collection: 'users',
        data: {
          email: googleUser.email.toLowerCase(),
          password: randomPassword,
          name: googleUser.name || null,
          roles: ['user'],
        },
      })
    }

    // For Google OAuth users, we create a JWT token directly
    // since we don't have their password for a standard login
    
    // Get the full user data with collection info needed for token
    const fullUser = await payload.findByID({
      collection: 'users',
      id: user.id,
    })
    
    // Generate token using JWT
    const jwt = await import('jsonwebtoken')
    const payloadConfig = await configPromise
    const secret = payloadConfig.secret
    
    const token = jwt.default.sign(
      {
        id: fullUser.id,
        email: fullUser.email,
        collection: 'users',
      },
      secret,
      { expiresIn: '7d' }
    )

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectUrl, request.url))

    // Set the auth token as a cookie
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Error in Google OAuth callback:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}
