'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { MailOpen, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [cooldown, setCooldown] = useState(0)

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleResend = async () => {
    if (isResending || cooldown > 0 || !email) return
    setIsResending(true)
    try {
      const res = await fetch('/api/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResendStatus(res.ok ? 'sent' : 'error')
      setCooldown(60)
    } catch {
      setResendStatus('error')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16">
      {/* Card */}
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        {/* Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MailOpen size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Check your inbox</h1>
          <p className="mt-2 text-slate-500">
            We sent a verification link to{' '}
            <span className="font-semibold text-slate-800 break-all">{email || 'your email'}</span>.
          </p>
        </div>

        {/* Steps */}
        <ol className="space-y-3">
          {[
            'Open the email from Banyamulenge Youth Kenya',
            'Click the "Verify My Email" button',
            'You\'ll be redirected to your dashboard',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* Spam note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Can&apos;t find it? Check your <strong>spam or junk folder</strong>.
        </div>

        {/* Resend */}
        <div className="space-y-3 border-t border-slate-100 pt-6">
          {resendStatus === 'sent' && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <CheckCircle2 size={16} />
              Verification email resent!
            </div>
          )}
          {resendStatus === 'error' && (
            <p className="text-center text-sm text-red-600">
              Failed to resend. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={isResending ? 'animate-spin' : ''} />
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
          </button>

          <Link
            href="/opportunities"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            Browse opportunities in the meantime
            <ArrowRight size={16} />
          </Link>

          <Link href="/login" className="block text-center text-sm text-slate-400 hover:text-slate-700">
            Already verified? Sign in →
          </Link>
        </div>
      </div>

      {/* Logo below */}
      <Link href="/" className="mt-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <Image src="/images/logo.png" alt="BYN-K" width={28} height={28} className="rounded" />
        <span className="text-sm font-black text-primary">BYN-K</span>
      </Link>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}
