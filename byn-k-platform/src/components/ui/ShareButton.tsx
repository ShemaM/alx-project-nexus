'use client'

import React, { useState, useEffect } from 'react'
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCopied, setShowCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(propUrl || '')

  useEffect(() => {
    // Set URL from window if not provided as prop or if prop is empty
    if (!propUrl) {
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

  const shareUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
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
