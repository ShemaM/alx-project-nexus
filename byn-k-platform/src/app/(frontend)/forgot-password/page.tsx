'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })
      // Always show success — never reveal whether email exists
      setIsSuccess(true)
    } catch {
      setIsSuccess(true)
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
            <KeyRound size={32} className="text-secondary" />
          </div>
          <h2 className="text-3xl font-black text-on-dark">
            Forgot your password?<br />
            <span className="text-secondary">No worries.</span>
          </h2>
          <p className="text-sm leading-7 text-muted-on-dark">
            Enter your registered email address and we&apos;ll send you a secure link to reset your
            password. The link is valid for 1 hour.
          </p>
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
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="BYN-K" width={32} height={32} className="rounded-lg" />
            <span className="font-black text-primary">BYN-K</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-slate-700">← Back</Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {isSuccess ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Check your inbox</h1>
                  <p className="mt-3 text-slate-500">
                    If an account is registered with{' '}
                    <span className="font-semibold text-slate-800">{email}</span>, you&apos;ll
                    receive a password reset link within a few minutes.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Can&apos;t see it? Check your spam or junk folder.
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 font-bold text-primary hover:underline"
                >
                  <ArrowLeft size={16} />
                  Back to Sign In
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Reset password</h1>
                  <p className="mt-1 text-slate-500">
                    Enter your email and we&apos;ll send a reset link.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? 'Sending link…' : 'Send Reset Link'}
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
