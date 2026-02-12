'use client'

import { useEffect } from 'react'
import { OpportunityCategory } from '@/types'
import { addActivity } from '@/lib/opportunity-activity'

interface OpportunityActivityTrackerProps {
  id: number
  title: string
  organizationName?: string
  category?: OpportunityCategory
  slug?: string
}

export default function OpportunityActivityTracker({
  id,
  title,
  organizationName,
  category,
  slug,
}: Readonly<OpportunityActivityTrackerProps>) {
  useEffect(() => {
    if (!id || !title) return
    const url = typeof window !== 'undefined' ? window.location.pathname : '/opportunities'
    addActivity('viewed', {
      id,
      title,
      organizationName,
      category,
      slug,
      url,
    })
  }, [id, title, organizationName, category, slug])

  return null
}
