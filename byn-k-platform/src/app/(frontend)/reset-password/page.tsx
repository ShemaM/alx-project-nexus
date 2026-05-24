'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { ok: password.length >= 8, label: '8+ chars' },
    { ok: /[A-Z]/.test(password), label: 'Uppercase' },
    { ok: /[0-9]/.test(password), label: 'Number' },
  ]
  return (
    <div className="flex gap-2 pt-1.5">
      {checks.map((c) => (
        <span
          key={c.label}
          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
            c.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {c.label}
        </span>
      ))}
    </div>
  )
}

type PageState = 'form' | 'success' | 'expired'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [state, setState] = useState<PageState>('form')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) setState('expired')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setState('success')
      } else {
        const msg: string = data.error || 'Failed to reset password'
        if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
          setState('expired')
        } else {
          setError(msg)
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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

        <div className="relative z-10 space-y-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-on-dark/70 bg-glass-on-dark">
            <ShieldCheck size={32} className="text-secondary" />
          </div>
          <h2 className="text-3xl font-black text-on-dark">
            Create a new<br />
            <span className="text-secondary">secure password.</span>
          </h2>
          <p className="text-sm leading-7 text-muted-on-dark">
            Choose a strong password you haven&apos;t used before. It must be at least 8 characters
            long and cannot be entirely numeric.
          </p>
          <div className="space-y-2 rounded-xl border border-border-on-dark/70 bg-glass-on-dark p-4">
            <p className="text-xs font-semibold text-on-dark">Password tips</p>
            <ul className="space-y-1 text-xs text-muted-on-dark">
              <li>• Mix uppercase &amp; lowercase letters with numbers</li>
              <li>• Avoid using your name or email address</li>
              <li>• Never reuse passwords across different sites</li>
            </ul>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="BYN-K" width={32} height={32} className="rounded-lg" />
            <span className="font-black text-primary">BYN-K</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-700">
            ← Back
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {/* ── Success state ── */}
            {state === 'success' && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Password updated!</h1>
                  <p className="mt-3 text-slate-500">
                    Your password has been reset successfully. You can now sign in with your new
                    password.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  Sign in to your account
                </Link>
              </div>
            )}

            {/* ── Expired / invalid state ── */}
            {state === 'expired' && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                  <Lock size={40} className="text-red-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Link expired</h1>
                  <p className="mt-3 text-slate-500">
                    This password reset link is invalid or has expired. Reset links are only valid
                    for 1 hour.
                  </p>
                </div>
                <Link
                  href="/forgot-password"
                  className="flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  Request a new reset link
                </Link>
                <Link href="/login" className="block text-sm text-slate-400 hover:text-slate-700">
                  Back to Sign In
                </Link>
              </div>
            )}

            {/* ── Form state ── */}
            {state === 'form' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Set new password</h1>
                  <p className="mt-1 text-slate-500">Choose a strong password for your account.</p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && <PasswordStrength password={password} />}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm"
                      className="mb-1.5 block text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        id="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirm && password !== confirm && (
                      <p className="mt-1 text-xs text-red-600">Passwords don&apos;t match</p>
                    )}
                    {confirm && password === confirm && confirm.length >= 8 && (
                      <p className="mt-1 text-xs text-emerald-600">Passwords match ✓</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !password || !confirm}
                    className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Resetting…' : 'Reset Password'}
                  </button>
                </form>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
