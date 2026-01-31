/**
 * Admin Opportunities Page
 * 
 * Management view for administrators to perform CRUD operations on opportunities.
 * 
 * @module app/(frontend)/dashboard/opportunities
 */
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import OpportunitiesManager from '@/components/admin/OpportunitiesManager'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Opportunities - BYN-K Admin',
  description: 'Create, update, and manage opportunities',
}

export default function AdminOpportunitiesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <OpportunitiesManager />
      </main>
      <Footer />
    </div>
  )
}
