'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, CheckCircle2, Briefcase, ShieldCheck, Bell } from 'lucide-react'
import { getProviders, signIn } from 'next-auth/react'

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const features = [
  { icon: Briefcase, text: 'Browse 1,200+ verified opportunities' },
  { icon: ShieldCheck, text: 'Filter by your refugee documents' },
  { icon: Bell, text: 'Get personalised email alerts' },
]

function isSafeRedirect(url: string): boolean {
  if (typeof url !== 'string') return false
  if (!url.startsWith('/')) return false
  if (url.startsWith('//')) return false
  return true
}

const DEFAULT_POST_SIGNUP_REDIRECT = '/my-opportunities?tab=viewed'

const oauthErrors: Record<string, string> = {
  google_auth_failed: 'Google sign-up was cancelled or failed. Please try again.',
  no_code: 'Authentication failed. Please try again.',
  oauth_not_configured: 'Google sign-up is not configured. Please use email/password.',
  token_exchange_failed: 'Authentication failed. Please try again.',
  callback_failed: 'Sign-up failed. Please try again.',
}

export default function SignupPage() {
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') ?? ''
  const redirectUrl = isSafeRedirect(rawRedirect) ? rawRedirect : DEFAULT_POST_SIGNUP_REDIRECT
  const errorParam = searchParams.get('error')

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [oauthProviders, setOauthProviders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (errorParam) setError(oauthErrors[errorParam] ?? 'An error occurred during sign-up.')
  }, [errorParam])

  useEffect(() => {
    getProviders()
      .then((providers) => {
        const map: Record<string, boolean> = {}
        if (providers) Object.keys(providers).forEach((k) => (map[k] = true))
        setOauthProviders(map)
      })
      .catch(() => setOauthProviders({}))
  }, [])

  const passwordChecks = {
    length: formData.password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')

      // Redirect to check-email page after successful signup
      window.location.href = `/signup/check-email?email=${encodeURIComponent(formData.email)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = (provider: 'google' | 'linkedin') => {
    const callbackUrl = redirectUrl.includes('?') ? `${redirectUrl}&reset_activity=1` : `${redirectUrl}?reset_activity=1`
    void signIn(provider, { callbackUrl })
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-hero-dark p-10 lg:flex lg:w-[42%] xl:w-[45%]">
        <div className="byn-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image src="/images/logo.png" alt="BYN-K" width={48} height={48} className="rounded-xl" />
          <div className="flex flex-col">
            <span className="font-black leading-tight text-primary">BANYAMULENGE</span>
            <span className="text-xs font-semibold tracking-wider text-secondary">YOUTH KENYA</span>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="byn-kicker mb-3">Join our community</p>
            <h2 className="text-3xl font-black leading-tight text-on-dark xl:text-4xl">
              Your next opportunity starts{' '}
              <span className="text-secondary">with one registration.</span>
            </h2>
          </div>
          <ul className="space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-on-dark">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border-on-dark/70 bg-glass-on-dark">
                  <Icon size={16} className="text-secondary" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 rounded-xl border border-border-on-dark/70 bg-glass-on-dark p-5 text-sm leading-7 text-muted-on-dark backdrop-blur-sm">
          <p className="font-bold text-on-dark">100% free. Always.</p>
          We will never charge job seekers. Our mission is to remove every barrier between
          refugee youth and opportunity.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="BYN-K" width={32} height={32} className="rounded-lg" />
            <span className="font-black text-primary">BYN-K</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-slate-700">← Back</Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
              <p className="mt-1 text-slate-500">Free forever. No credit card required.</p>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* OAuth buttons */}
            {(oauthProviders.google || oauthProviders.linkedin) && (
              <div className="space-y-3">
                {oauthProviders.google && (
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:shadow-sm"
                  >
                    <GoogleIcon />
                    Sign up with Google
                  </button>
                )}
                {oauthProviders.linkedin && (
                  <button
                    type="button"
                    onClick={() => handleOAuth('linkedin')}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-linkedin py-3 text-sm font-semibold text-white transition hover:bg-linkedin-dark"
                  >
                    Sign up with LinkedIn
                  </button>
                )}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-400">or sign up with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 flex gap-4">
                    {[
                      { ok: passwordChecks.length, label: '8+ chars' },
                      { ok: passwordChecks.hasLetter, label: 'Letter' },
                      { ok: passwordChecks.hasNumber, label: 'Number' },
                    ].map(({ ok, label }) => (
                      <span key={label} className={`flex items-center gap-1 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle2 size={12} />
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat password"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle confirm password">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-slate-400">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="underline hover:text-slate-700">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-slate-700">Privacy Policy</Link>.
              </p>
            </form>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href={`/login${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`} className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
