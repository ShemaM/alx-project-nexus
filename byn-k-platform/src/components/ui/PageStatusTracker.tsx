'use client'

import { useEffect } from 'react'

export type PageStatus = 'loaded' | 'fallback' | 'error'

const TITLES: Record<PageStatus, string> = {
  loaded: 'Banyamulenge Youth Kenya Platform - Opportunities for Banyamulenge Youth',
  fallback: 'Offline · Banyamulenge Youth Kenya Platform',
  error: 'Error · Banyamulenge Youth Kenya Platform',
}

/** Synchronizes the browser title with the current app status. */
export const PageStatusTracker = ({ status }: { status: PageStatus }) => {
  useEffect(() => {
    document.title = TITLES[status] ?? TITLES.loaded
  }, [status])

  return null
}

export default PageStatusTracker
