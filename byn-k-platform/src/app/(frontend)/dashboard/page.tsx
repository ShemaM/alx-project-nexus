/**
 * Admin Dashboard Landing Page
 * 
 * Main admin entry point with quick access to management features.
 * 
 * @module app/(frontend)/dashboard
 */
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { 
  BarChart3, 
  Briefcase, 
  Building2, 
  Users, 
  Settings, 
  FileText,
  Calendar,
  Bell,
  ExternalLink
} from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - BYN-K Platform',
  description: 'Admin management dashboard for BYN-K Platform',
}

const adminLinks = [
  {
    title: 'Analytics',
    description: 'View platform metrics and statistics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'bg-blue-500',
  },
  {
    title: 'Opportunities',
    description: 'Manage jobs, scholarships, internships',
    href: '/dashboard/opportunities',
    icon: Briefcase,
    color: 'bg-amber-500',
  },
  {
    title: 'Partners',
    description: 'Manage partner organizations',
    href: '/admin/collections/partners',
    icon: Building2,
    color: 'bg-purple-500',
  },
  {
    title: 'Users',
    description: 'Manage user accounts and roles',
    href: '/admin/collections/users',
    icon: Users,
    color: 'bg-emerald-500',
  },
  {
    title: 'Events',
    description: 'Manage community events',
    href: '/admin/collections/events',
    icon: Calendar,
    color: 'bg-pink-500',
  },
  {
    title: 'Resources',
    description: 'Manage resource library',
    href: '/admin/collections/resources',
    icon: FileText,
    color: 'bg-cyan-500',
  },
  {
    title: 'Announcements',
    description: 'Manage site announcements',
    href: '/admin/collections/announcements',
    icon: Bell,
    color: 'bg-orange-500',
  },
  {
    title: 'Site Settings',
    description: 'Configure site-wide settings',
    href: '/admin/globals/site-settings',
    icon: Settings,
    color: 'bg-slate-500',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content and settings</p>
        </div>

        {/* Quick Link to Payload Admin */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Full CMS Admin Panel</h2>
              <p className="text-blue-100">Access the complete Payload CMS admin interface for advanced management</p>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Open CMS Admin
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>

        {/* Admin Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.title}
                href={link.href}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all group"
              >
                <div className={`${link.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500">{link.description}</p>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats Preview */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/collections/opportunities/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Briefcase size={16} />
              Add Opportunity
            </Link>
            <Link
              href="/admin/collections/partners/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Building2 size={16} />
              Add Partner
            </Link>
            <Link
              href="/admin/collections/events/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
            >
              <Calendar size={16} />
              Add Event
            </Link>
            <Link
              href="/admin/collections/announcements/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <Bell size={16} />
              Add Announcement
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
