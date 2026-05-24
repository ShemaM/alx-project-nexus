import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendVerificationEmail } from '@/lib/email'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bynk-dev-secret')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Generate a 24-hour verification JWT
    const token = await new SignJWT({ email: email.toLowerCase(), purpose: 'email_verification' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(SECRET)

    const verificationUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`

    await sendVerificationEmail({ to: email, name: name || '', verificationUrl })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[send-verification]', error)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
