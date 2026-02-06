'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { unsubscribe } from '@/lib/api'

type UnsubscribeStatus = 'loading' | 'success' | 'already_unsubscribed' | 'error'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<UnsubscribeStatus>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function processUnsubscribe() {
      if (!token) {
        setStatus('error')
        setMessage('Invalid unsubscribe link.')
        return
      }

      try {
        const response = await unsubscribe(token)
        
        if (response.success) {
          if (response.status === 'already_unsubscribed') {
            setStatus('already_unsubscribed')
            setMessage('You are already unsubscribed.')
          } else {
            setStatus('success')
            setMessage(response.message || 'You have been successfully unsubscribed.')
          }
        } else {
          setStatus('error')
          setMessage(response.message || 'Failed to unsubscribe. Please try again.')
        }
      } catch {
        setStatus('error')
        setMessage('An error occurred. Please try again.')
      }
    }

    processUnsubscribe()
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
                Processing your request...
              </h1>
              <p className="text-slate-600">
                Please wait while we update your preferences.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6">👋</div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                You&apos;ve been unsubscribed
              </h1>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <p className="text-slate-500 text-sm mb-6">
                We&apos;re sorry to see you go! You can always subscribe again from our homepage.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}

          {status === 'already_unsubscribed' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Already Unsubscribed
              </h1>
              <p className="text-slate-600 mb-6">
                {message}
              </p>
              <Link
                href="/"
                className="inline-block bg-[#F5D300] hover:bg-[#D4B500] text-[#1E6BB8] px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Back to Home
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
