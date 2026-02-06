'use client'

import React, { useState, useCallback } from 'react'
import { subscribe } from '@/lib/api'

type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error'

interface EmailSubscriptionProps {
  className?: string
}

export const EmailSubscription: React.FC<EmailSubscriptionProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SubscriptionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await subscribe(email)
      
      if (response.success) {
        if (response.status === 'already_subscribed') {
          setStatus('already_subscribed')
        } else {
          setStatus('success')
        }
        setEmail('')
      } else {
        setErrorMessage(response.message || 'Failed to subscribe. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.')
      setStatus('error')
    }
  }, [email])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // Clear error when user starts typing
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }, [status])

  // Success state
  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📧</span>
          <h3 className="text-lg font-bold text-green-800">Check your email!</h3>
        </div>
        <p className="text-green-700">
          We&apos;ve sent a confirmation link to your email. Click it to start receiving opportunity alerts.
        </p>
      </div>
    )
  }

  // Already subscribed state
  if (status === 'already_subscribed') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">✅</span>
          <h3 className="text-lg font-bold text-blue-800">You&apos;re already subscribed!</h3>
        </div>
        <p className="text-blue-700">
          You&apos;re already on our mailing list. You&apos;ll receive notifications about new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🔔</span>
        <h3 className="text-lg font-bold text-white">Never miss an opportunity</h3>
      </div>
      
      <p className="text-white/90 text-sm mb-4">
        Get notified when new opportunities are posted. No spam, just relevant alerts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5D300] ${
              status === 'error' ? 'border-2 border-red-500' : ''
            }`}
            disabled={status === 'loading'}
            aria-label="Email address"
            aria-describedby={errorMessage ? 'email-error' : undefined}
          />
        </div>

        {status === 'error' && errorMessage && (
          <p id="email-error" className="text-red-200 text-sm" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] py-3 rounded-lg font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subscribing...
            </span>
          ) : (
            'Subscribe for Alerts'
          )}
        </button>
      </form>

      <p className="text-white/70 text-xs mt-3 text-center">
        🔒 We respect your privacy. Unsubscribe anytime with one click.
      </p>
    </div>
  )
}
