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
import { getCurrentUser } from '@/lib/api'
import { AuthUser, isSuperAdmin } from '@/lib/authz'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Manage Opportunities - BYN-K Admin',
  description: 'Create, update, and manage opportunities',
}

export default async function AdminOpportunitiesPage() {
  const user = await getCurrentUser() as AuthUser | null

  if (!user) {
    redirect('/login?redirect=/dashboard/opportunities')
  }

  if (!isSuperAdmin(user)) {
    redirect('/')
  }

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
