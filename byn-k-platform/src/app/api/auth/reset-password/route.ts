import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bynk-dev-secret')
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Verify the reset JWT
    let email: string
    try {
      const { payload } = await jwtVerify(token, SECRET)
      if (payload.purpose !== 'password_reset' || typeof payload.email !== 'string') {
        return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
      }
      email = payload.email
    } catch {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // Forward the password change to Django
    const djangoRes = await fetch(`${API_BASE}/auth/password/reset/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password1: password, new_password2: password }),
    })

    if (!djangoRes.ok) {
      const err = await djangoRes.json().catch(() => ({}))
      const message = err.detail || err.new_password2?.[0] || 'Failed to reset password'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
