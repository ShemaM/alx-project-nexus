'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Eye, Send, Bookmark, ArrowRight } from 'lucide-react'
import { getCurrentUser } from '@/lib/api'
import { getActivity, OpportunityActivityItem } from '@/lib/opportunity-activity'

type TabKey = 'viewed' | 'applied' | 'bookmarked'

const tabConfig: Record<TabKey, { label: string; icon: React.ElementType }> = {
  viewed: { label: 'Viewed Opportunities', icon: Eye },
  applied: { label: 'Applied Opportunities', icon: Send },
  bookmarked: { label: 'Bookmarked Opportunities', icon: Bookmark },
}

function formatWhen(timestamp: string) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function MyOpportunitiesPage() {
  const searchParams = useSearchParams()
  const welcomeMessage = searchParams.get('welcome')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewed, setViewed] = useState<OpportunityActivityItem[]>([])
  const [applied, setApplied] = useState<OpportunityActivityItem[]>([])
  const [bookmarked, setBookmarked] = useState<OpportunityActivityItem[]>([])

  const requestedTab = (searchParams.get('tab') || '').toLowerCase()
  const activeTab: TabKey = requestedTab === 'applied' || requestedTab === 'bookmarked' ? (requestedTab as TabKey) : 'viewed'

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getCurrentUser()
        setIsAuthenticated(!!user)
      } finally {
        setViewed(getActivity('viewed'))
        setApplied(getActivity('applied'))
        setBookmarked(getActivity('bookmarked'))
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const activeItems = useMemo(() => {
    if (activeTab === 'applied') return applied
    if (activeTab === 'bookmarked') return bookmarked
    return viewed
  }, [activeTab, applied, bookmarked, viewed])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Opportunities</h1>
        <p className="text-slate-600 mb-6">Track what you viewed, applied for, and saved.</p>
        {welcomeMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            {welcomeMessage}
          </div>
        )}

        {!isLoading && !isAuthenticated && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            Sign in to sync your activity across devices.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {(Object.keys(tabConfig) as TabKey[]).map((tab) => {
            const Icon = tabConfig[tab].icon
            const count = tab === 'viewed' ? viewed.length : tab === 'applied' ? applied.length : bookmarked.length
            const active = tab === activeTab
            return (
              <Link
                key={tab}
                href={`/my-opportunities?tab=${tab}`}
                className={`rounded-xl border p-4 transition-colors ${
                  active ? 'border-[#2D8FDD] bg-[#2D8FDD]/5' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-900">
                    <Icon size={16} />
                    {tabConfig[tab].label}
                  </span>
                  <span className="text-sm font-bold text-[#2D8FDD]">{count}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {activeItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            No items yet in {tabConfig[activeTab].label.toLowerCase()}.
          </div>
        ) : (
          <div className="space-y-3">
            {activeItems.map((item) => (
              <Link
                key={`${activeTab}-${item.id}`}
                href={item.url || '/opportunities'}
                className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#2D8FDD]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{item.organizationName || 'Unknown organization'}</p>
                    <p className="text-xs text-slate-500 mt-2">Last action: {formatWhen(item.timestamp)}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
