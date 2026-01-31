/**
 * Admin Analytics Page
 * 
 * Dashboard view for administrators to see platform metrics.
 * 
 * @module app/(frontend)/admin/analytics
 */
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics Dashboard - BYN-K Admin',
  description: 'View platform analytics and metrics',
}

export default function AdminAnalyticsPage() {
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
