import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bynk-dev-secret')

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    if (payload.purpose !== 'email_verification' || typeof payload.email !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // Mark as verified via a cookie (soft verification gate)
    const response = NextResponse.json({ success: true, email: payload.email })
    response.cookies.set('email-verified', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    return response
  } catch (error) {
    console.error('[verify-token]', error)
    return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 })
  }
}
