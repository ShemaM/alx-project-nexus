'use client'

import React, { useState, useEffect } from 'react'
import { ExternalLink, Mail, Star } from 'lucide-react'
import ShareButton from '@/components/ui/ShareButton'

interface OpportunityActionsProps {
  opportunityId: string
  title: string
  applyUrl: string
  isEmailApplication: boolean
}

export const OpportunityActions: React.FC<OpportunityActionsProps> = ({
  opportunityId,
  title,
  applyUrl,
  isEmailApplication,
}) => {
  const [shareUrl, setShareUrl] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Set share URL on client side
    setShareUrl(window.location.href)

    // Check bookmark status
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

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    setIsLoadingBookmark(true)

    try {
      if (isBookmarked) {
        const response = await fetch(`/api/bookmarks?opportunityId=${opportunityId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setIsBookmarked(false)
        }
      } else {
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
      setIsLoadingBookmark(false)
    }
  }

  return (
    <div className="p-6 md:p-8 border-t border-[#E2E8F0] bg-slate-50">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Apply Button */}
        <a 
          href={applyUrl}
          target={isEmailApplication ? undefined : '_blank'}
          rel={isEmailApplication ? undefined : 'noopener noreferrer'}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-6 py-4 rounded-xl font-bold text-base transition-colors"
        >
          {isEmailApplication ? (
            <>Apply via Email <Mail size={18} /></>
          ) : (
            <>Apply Now <ExternalLink size={18} /></>
          )}
        </a>
        
        {/* Bookmark Button */}
        <button 
          onClick={handleToggleBookmark}
          disabled={isLoadingBookmark}
          className={`flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 px-6 py-4 rounded-xl font-bold text-base transition-colors ${
            isBookmarked ? 'text-[#F5D300]' : 'text-slate-700'
          } ${isLoadingBookmark ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!isAuthenticated ? 'Sign in to save' : isBookmarked ? 'Remove from saved' : 'Save opportunity'}
        >
          <Star size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
        
        {/* Share Button */}
        <ShareButton 
          title={title}
          url={shareUrl}
        />
      </div>
    </div>
  )
}

export default OpportunityActions
