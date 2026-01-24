'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Share2 } from 'lucide-react'

interface ShareButtonProps {
  title: string
  url?: string
  className?: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  url: propUrl,
  className = '',
}) => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCopied, setShowCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(propUrl || '')

  useEffect(() => {
    // Set URL from window if not provided as prop or if prop is empty
    // This only runs on client side
    if (!propUrl && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [propUrl])

  // Update URL if prop changes
  useEffect(() => {
    if (propUrl) {
      setCurrentUrl(propUrl)
    }
  }, [propUrl])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [currentUrl])

  const handleShare = async () => {
    if (!isAuthenticated) {
      // Redirect to login page using Next.js router
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
      router.push('/login?redirect=' + encodeURIComponent(currentPath))
      return
    }

    // Use Web Share API if available
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: currentUrl,
        })
      } catch (err) {
        // User cancelled or error - fall back to copying link
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard()
        }
      }
    } else {
      // Fall back to copying the link
      copyToClipboard()
    }
  }

  return (
    <button 
      onClick={handleShare}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-xl font-bold text-base transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label="Share opportunity"
      title={!isAuthenticated && !isLoading ? 'Sign in to share' : 'Share opportunity'}
    >
      <Share2 size={18} />
      {showCopied ? 'Link Copied!' : 'Share'}
    </button>
  )
}

export default ShareButton
