'use client'

import { OpportunityCategory } from '@/types'

export type ActivityType = 'viewed' | 'applied' | 'bookmarked'

export interface OpportunityActivityItem {
  id: number
  title: string
  organizationName?: string
  category?: OpportunityCategory
  slug?: string
  url: string
  timestamp: string
}

const STORAGE_KEYS: Record<ActivityType, string> = {
  viewed: 'bynk.activity.viewed',
  applied: 'bynk.activity.applied',
  bookmarked: 'bynk.activity.bookmarked',
}

const MAX_ITEMS = 100

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readItems(type: ActivityType): OpportunityActivityItem[] {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS[type])
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeItems(type: ActivityType, items: OpportunityActivityItem[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(items.slice(0, MAX_ITEMS)))
}

export function getActivity(type: ActivityType): OpportunityActivityItem[] {
  return readItems(type)
}

export function addActivity(type: ActivityType, item: Omit<OpportunityActivityItem, 'timestamp'>) {
  const now = new Date().toISOString()
  const existing = readItems(type)
  const deduped = existing.filter((entry) => entry.id !== item.id)
  writeItems(type, [{ ...item, timestamp: now }, ...deduped])
}

export function removeBookmarkedActivity(opportunityId: number) {
  const existing = readItems('bookmarked')
  writeItems(
    'bookmarked',
    existing.filter((entry) => entry.id !== opportunityId)
  )
}

export function isBookmarkedActivity(opportunityId: number) {
  return readItems('bookmarked').some((entry) => entry.id === opportunityId)
}
