'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface BookmarkButtonProps {
  opportunityId: string | number
  className?: string
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  opportunityId,
  className = '',
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check bookmark status on mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const response = await fetch(`/api/bookmarks/check?opportunityId=${opportunityId}`)
        const data = await response.json()
        setIsBookmarked(data.isBookmarked)
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.error('Error checking bookmark status:', error)
      }
    }

    checkBookmarkStatus()
  }, [opportunityId])

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?opportunityId=${opportunityId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsBookmarked(false)
        }
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ opportunityId: Number(opportunityId) }),
        })
        if (response.ok) {
          setIsBookmarked(true)
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`transition-colors ${
        isBookmarked
          ? 'text-[#F5D300] fill-[#F5D300]'
          : 'text-slate-300 hover:text-[#F5D300]'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Save opportunity'}
      title={!isAuthenticated ? 'Login to bookmark' : isBookmarked ? 'Remove bookmark' : 'Save opportunity'}
    >
      <Star size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  )
}

export default BookmarkButton
