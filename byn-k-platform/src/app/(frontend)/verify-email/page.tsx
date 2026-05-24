'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react'

type VerifyState = 'loading' | 'success' | 'error'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<VerifyState>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMsg('No verification token found. Please use the link from your email.')
      return
    }

    fetch(`/api/email/verify-token?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setState('success')
        } else {
          const data = await res.json().catch(() => ({}))
          setErrorMsg(data.error || 'This link is invalid or has expired.')
          setState('error')
        }
      })
      .catch(() => {
        setErrorMsg('Something went wrong. Please try again.')
        setState('error')
      })
  }, [token])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="space-y-4 text-center">
          <Loader2 size={48} className="mx-auto animate-spin text-primary" />
          <p className="text-slate-600 font-semibold">Verifying your email…</p>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mx-auto">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">Email verified!</h1>
            <p className="mt-2 text-slate-500">
              Your account is now fully activated. You can save opportunities, set alerts, and
              track your applications.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/opportunities"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              Browse opportunities
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/my-opportunities"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to my dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mx-auto">
          <XCircle size={40} className="text-red-500" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-slate-900">Verification failed</h1>
          <p className="mt-2 text-slate-500">{errorMsg}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            Sign in to resend verification
          </Link>
          <Link
            href="/"
            className="block text-sm text-slate-400 hover:text-slate-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  )
}
