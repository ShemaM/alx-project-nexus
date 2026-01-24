import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/google - Redirect to Google OAuth consent screen
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Google OAuth is not configured' },
        { status: 500 }
      )
    }

    // Get redirect URL from query params (for redirect after login)
    const searchParams = request.nextUrl.searchParams
    const redirectUrl = searchParams.get('redirect') || '/'
    
    // Create state parameter with redirect URL (for CSRF protection and redirect)
    const state = Buffer.from(JSON.stringify({ redirect: redirectUrl })).toString('base64')
    
    // Build the callback URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const callbackUrl = `${protocol}://${host}/api/auth/google/callback`
    
    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', clientId)
    googleAuthUrl.searchParams.set('redirect_uri', callbackUrl)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', 'email profile')
    googleAuthUrl.searchParams.set('state', state)
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'consent')
    
    return NextResponse.redirect(googleAuthUrl.toString())
  } catch (error) {
    console.error('Error initiating Google OAuth:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Google sign-in' },
      { status: 500 }
    )
  }
}
