/**
 * Admin Analytics Page
 * 
 * Dashboard view for administrators to see platform metrics.
 * 
 * @module app/(frontend)/dashboard/analytics
 */
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'
import { getCurrentUser } from '@/lib/api'
import { isSuperAdmin } from '@/lib/authz'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics Dashboard - BYN-K Admin',
  description: 'View platform analytics and metrics',
}

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/analytics')
  }

  if (!isSuperAdmin(user)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  )
}
