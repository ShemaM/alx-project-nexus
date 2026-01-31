/**
 * Analytics API Route
 * 
 * Provides analytics data for the admin dashboard.
 * Returns aggregated metrics and activity data.
 * 
 * @module api/admin/analytics
 */
import { NextResponse } from 'next/server'
import { getAnalyticsOverview } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const analytics = await getAnalyticsOverview()
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
