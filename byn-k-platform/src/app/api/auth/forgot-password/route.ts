import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendPasswordResetEmail } from '@/lib/email'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bynk-dev-secret')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ success: true })
    }

    // Check if user exists in Django backend
    let userName = ''
    try {
      const res = await fetch(`${API_BASE}/auth/me/`, {
        headers: { 'X-Lookup-Email': email.toLowerCase() },
      })
      if (res.ok) {
        const data = await res.json()
        userName = data.first_name || data.username || ''
      }
    } catch {
      // Silently continue — don't reveal whether email exists
    }

    // Generate a 1-hour reset JWT
    const token = await new SignJWT({
      email: email.toLowerCase(),
      purpose: 'password_reset',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .setIssuedAt()
      .sign(SECRET)

    const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`

    await sendPasswordResetEmail({ to: email, name: userName, resetUrl })

    // Always respond with success (prevent email enumeration)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[forgot-password]', error)
    return NextResponse.json({ success: true }) // Never reveal errors to client
  }
}
