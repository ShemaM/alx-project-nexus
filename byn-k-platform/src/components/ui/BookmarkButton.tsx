'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { addActivity, isBookmarkedActivity, removeBookmarkedActivity } from '@/lib/opportunity-activity'
import { OpportunityCategory } from '@/types'

interface BookmarkButtonProps {
  opportunityId: string | number
  title?: string
  organizationName?: string
  category?: OpportunityCategory
  slug?: string
  className?: string
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  opportunityId,
  title,
  organizationName,
  category,
  slug,
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
        const idNum = typeof opportunityId === 'number' ? opportunityId : Number(opportunityId)
        setIsBookmarked(data.isBookmarked || (!isNaN(idNum) && isBookmarkedActivity(idNum)))
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
      window.location.href = '/login?redirect=' + encodeURIComponent('/my-opportunities?tab=bookmarked')
      return
    }

    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?opportunityId=${opportunityId}`, {
          method: 'DELETE',
        })
        if (response.ok || response.status === 501 || response.status === 404) {
          setIsBookmarked(false)
          removeBookmarkedActivity(Number(opportunityId))
        }
      } else {
        // Add bookmark - validate and convert ID
        const idNum = typeof opportunityId === 'number' ? opportunityId : Number(opportunityId)
        if (isNaN(idNum)) {
          console.error('Invalid opportunity ID:', opportunityId)
          return
        }
        
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ opportunityId: idNum }),
        })
        if (response.ok || response.status === 501) {
          setIsBookmarked(true)
          addActivity('bookmarked', {
            id: idNum,
            title: title || 'Saved Opportunity',
            organizationName,
            category,
            slug,
            url: typeof window !== 'undefined' ? window.location.pathname : '/opportunities',
          })
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
