'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'

export type ErrorBannerProps = {
  message: string
  onRetry: () => void
}

/** Persistent alert shown when the opportunities feed cannot be fetched; includes retry logic. */
export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  const [retryCount, setRetryCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!message) return
    bannerRef.current?.focus()
  }, [message])

  useEffect(() => {
    if (countdown <= 0) {
      window.clearInterval(intervalRef.current ?? undefined)
      intervalRef.current = null
      return
    }

    intervalRef.current = window.setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [countdown])

  const handleRetry = () => {
    // Exponential backoff timer for user-triggered retries.
    const delay = Math.min(20000, 1000 * 2 ** retryCount)
    setRetryCount((prev) => prev + 1)
    setCountdown(Math.round(delay / 1000))
    onRetry()
  }

  return (
    <div
      ref={bannerRef}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      className="card text-gray-700 mb-6"
      style={{ borderColor: 'var(--error)', backgroundColor: 'var(--error-bg)' }}
    >
      <p className="text-base font-semibold text-error">We could not reach the opportunities feed.</p>
      <p className="text-sm text-gray-700 mt-1">
        This usually happens when the backend is offline or your network is unstable. We're showing
        cached data so you can still browse the site.
      </p>
      <p className="text-sm text-gray-700 mt-1">
        Try again when the indicator below is ready, or verify that you have a strong connection.
      </p>
      <div className="flex flex-wrap gap-3 mt-4">
        <Button variant="primary" onClick={handleRetry} disabled={countdown > 0}>
          {countdown > 0 ? `Retry again (${countdown}s)` : 'Retry now'}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
          Refresh page
        </Button>
      </div>
    </div>
  )
}

export default ErrorBanner
