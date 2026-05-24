'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Briefcase, ShieldCheck, Bell } from 'lucide-react'
import { getProviders, signIn } from 'next-auth/react'
import { clearAllActivity } from '@/lib/opportunity-activity'

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const features = [
  { icon: Briefcase, text: '1,200+ verified opportunities' },
  { icon: ShieldCheck, text: 'Refugee-document filtering' },
  { icon: Bell, text: 'Personalised email alerts' },
]

function isSafeRedirect(url: string): boolean {
  if (typeof url !== 'string') return false
  if (!url.startsWith('/')) return false
  if (url.startsWith('//')) return false
  return true
}

const DEFAULT_POST_LOGIN_REDIRECT = '/my-opportunities?tab=viewed'

const errorMessages: Record<string, string> = {
  google_auth_failed: 'Google sign-in was cancelled or failed. Please try again.',
  no_code: 'Authentication failed. Please try again.',
  oauth_not_configured: 'Google sign-in is not configured. Please use email/password.',
  token_exchange_failed: 'Authentication failed. Please try again.',
  user_info_failed: 'Could not retrieve your information from Google.',
  no_email: 'Could not access your email from Google.',
  callback_failed: 'Sign-in failed. Please try again.',
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') ?? ''
  const redirectUrl = isSafeRedirect(rawRedirect) ? rawRedirect : DEFAULT_POST_LOGIN_REDIRECT
  const errorParam = searchParams.get('error')
  const messageParam = searchParams.get('message')

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [oauthProviders, setOauthProviders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (errorParam) setError(errorMessages[errorParam] ?? 'An error occurred during sign-in.')
    if (messageParam) setMessage(messageParam)
  }, [errorParam, messageParam])

  useEffect(() => {
    getProviders()
      .then((providers) => {
        const map: Record<string, boolean> = {}
        if (providers) Object.keys(providers).forEach((k) => (map[k] = true))
        setOauthProviders(map)
      })
      .catch(() => setOauthProviders({}))
  }, [])

  const buildWelcomeMessage = (name: string) => {
    const first = (name || 'there').trim().split(/\s+/)[0]
    const hour = new Date().getHours()
    const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    return `Good ${period}, ${first}, welcome to Banyamulenge Youth Kenya.`
  }

  const appendParams = (target: string, params: Record<string, string>) => {
    try {
      const u = new URL(target, window.location.origin)
      Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
      return `${u.pathname}${u.search}${u.hash}`
    } catch {
      return target
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      const name = data?.user?.display_name || data?.user?.first_name || data?.user?.username || data?.user?.email?.split?.('@')?.[0] || 'there'
      clearAllActivity()
      window.location.href = appendParams(redirectUrl, { welcome: buildWelcomeMessage(name), reset_activity: '1' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = (provider: 'google' | 'linkedin') => {
    void signIn(provider, { callbackUrl: appendParams(redirectUrl, { reset_activity: '1' }) })
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-hero-dark p-10 lg:flex lg:w-[42%] xl:w-[45%]">
        <div className="byn-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image src="/images/logo.png" alt="BYN-K" width={48} height={48} className="rounded-xl" />
          <div className="flex flex-col">
            <span className="font-black leading-tight text-primary">BANYAMULENGE</span>
            <span className="text-xs font-semibold tracking-wider text-secondary">YOUTH KENYA</span>
          </div>
        </Link>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="byn-kicker mb-3">Your gateway to opportunity</p>
            <h2 className="text-3xl font-black leading-tight text-on-dark xl:text-4xl">
              Connecting refugee youth with{' '}
              <span className="text-secondary">life-changing opportunities</span> in Kenya.
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

        {/* Bottom testimonial */}
        <blockquote className="relative z-10 rounded-xl border border-border-on-dark/70 bg-glass-on-dark p-5 text-sm leading-7 text-muted-on-dark backdrop-blur-sm">
          &ldquo;BYN-K helped me find a fellowship that matched my CTD — something I never thought
          possible. My life changed from that one listing.&rdquo;
          <footer className="mt-2 font-semibold text-secondary">— Community member, Nairobi</footer>
        </blockquote>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile logo bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="BYN-K" width={32} height={32} className="rounded-lg" />
            <span className="font-black text-primary">BYN-K</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-slate-700">← Back</Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-6">
            {/* Heading */}
            <div>
              <h1 className="text-3xl font-black text-slate-900">Welcome back</h1>
              <p className="mt-1 text-slate-500">Sign in to access your bookmarked opportunities.</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                {message}
              </div>
            )}

            {/* OAuth */}
            {(oauthProviders.google || oauthProviders.linkedin) && (
              <div className="space-y-3">
                {oauthProviders.google && (
                  <button
                    type="button"
                    onClick={() => handleOAuth('google')}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:shadow-sm"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                )}
                {oauthProviders.linkedin && (
                  <button
                    type="button"
                    onClick={() => handleOAuth('linkedin')}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-linkedin py-3 text-sm font-semibold text-white transition hover:bg-linkedin-dark"
                  >
                    Continue with LinkedIn
                  </button>
                )}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-400">or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" size={18} />
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

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href={`/signup${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
                className="font-bold text-primary hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
