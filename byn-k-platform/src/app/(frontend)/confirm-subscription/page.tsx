'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { confirmSubscription } from '@/lib/api'

type ConfirmationStatus = 'loading' | 'success' | 'already_confirmed' | 'error'

export default function ConfirmSubscriptionPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function confirm() {
      if (!token) {
        setStatus('error')
        setMessage('Invalid confirmation link. Please try subscribing again.')
        return
      }

      try {
        const response = await confirmSubscription(token)
        
        if (response.success) {
          if (response.status === 'already_confirmed') {
            setStatus('already_confirmed')
            setMessage('Your subscription is already confirmed!')
          } else {
            setStatus('success')
            setMessage(response.message || 'Your subscription has been confirmed!')
          }
        } else {
          setStatus('error')
          setMessage(response.message || 'Failed to confirm subscription. Please try again.')
        }
      } catch {
        setStatus('error')
        setMessage('An error occurred. Please try again.')
      }
    }

    confirm()
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          {status === 'loading' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2D8FDD] border-t-transparent mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Confirming your subscription...
              </h1>
              <p className="text-slate-600">
                Please wait while we verify your email.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-2xl font-bold text-green-700 mb-2">
                Subscription Confirmed!
              </h1>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <p className="text-slate-500 text-sm mb-6">
                You&apos;ll now receive notifications when new opportunities are posted.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Browse Opportunities
              </Link>
            </div>
          )}

          {status === 'already_confirmed' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-blue-700 mb-2">
                Already Confirmed
              </h1>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <Link
                href="/"
                className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Browse Opportunities
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6">😔</div>
              <h1 className="text-2xl font-bold text-red-700 mb-2">
                Something went wrong
              </h1>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <Link
                href="/"
                className="inline-block bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Go Back Home
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
