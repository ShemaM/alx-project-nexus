'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { OpportunityCard } from '@/components/cards/OpportunityCard'
import { Bookmark, AlertCircle, LogIn } from 'lucide-react'

interface BookmarkData {
  id: number
  opportunity: {
    id: number
    title: string
    category: string
    deadline: string
    isVerified: boolean
    applicationType: 'link' | 'email'
    applyLink?: string
    applicationEmail?: string
    emailSubjectLine?: string
    documentation?: string[]
    organization: {
      name: string
    }
  }
  notes?: string
  createdAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // First check if user is authenticated
        const authResponse = await fetch('/api/auth/me')
        const authData = await authResponse.json()

        if (!authData.authenticated) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Fetch bookmarks
        const response = await fetch('/api/bookmarks')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch bookmarks')
        }

        setBookmarks(data.bookmarks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  // Map category from Payload format to display format
  const mapCategory = (category: string) => {
    const categoryMap: Record<string, 'job' | 'scholarship' | 'internship' | 'fellowship'> = {
      jobs: 'job',
      scholarships: 'scholarship',
      internships: 'internship',
      fellowships: 'fellowship',
    }
    return categoryMap[category] || 'job'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Loading bookmarks...</div>
        </main>
        <Footer />
      </div>
    )
  }

  // Not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn size={40} className="text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#2D8FDD] mb-3">Sign in Required</h1>
            <p className="text-slate-500 mb-6">
              Please sign in to view your saved opportunities
            </p>
            <Link
              href="/login?redirect=/bookmarks"
              className="inline-block bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
            <p className="mt-4 text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup?redirect=/bookmarks" className="text-[#2D8FDD] hover:text-[#1E6BB8] font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="text-[#2D8FDD]" size={28} />
              <h1 className="text-2xl md:text-3xl font-bold text-[#2D8FDD]">
                My Saved Opportunities
              </h1>
            </div>
            <p className="text-slate-500">
              {bookmarks.length} {bookmarks.length === 1 ? 'opportunity' : 'opportunities'} saved
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Empty State */}
          {bookmarks.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark size={40} className="text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">No saved opportunities yet</h2>
              <p className="text-slate-500 mb-6">
                Start exploring and save opportunities you&apos;re interested in
              </p>
              <Link
                href="/"
                className="inline-block bg-[#2D8FDD] hover:bg-[#1E6BB8] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Opportunities
              </Link>
            </div>
          )}

          {/* Bookmarks Grid */}
          {bookmarks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <OpportunityCard
                  key={bookmark.id}
                  id={String(bookmark.opportunity.id)}
                  title={bookmark.opportunity.title}
                  organizationName={bookmark.opportunity.organization?.name || 'Unknown Organization'}
                  category={mapCategory(bookmark.opportunity.category)}
                  documentation={bookmark.opportunity.documentation || []}
                  deadline={bookmark.opportunity.deadline}
                  isVerified={bookmark.opportunity.isVerified}
                  applicationType={bookmark.opportunity.applicationType}
                  applyLink={bookmark.opportunity.applyLink}
                  applicationEmail={bookmark.opportunity.applicationEmail}
                  emailSubjectLine={bookmark.opportunity.emailSubjectLine}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
