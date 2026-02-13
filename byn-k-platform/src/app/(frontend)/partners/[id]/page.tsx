import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, ArrowLeft, Briefcase } from 'lucide-react'

// Use ISR with revalidation instead of force-dynamic for better performance
export const revalidate = 60

interface PartnerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PartnerPageProps) {
  const { id } = await params
  return {
    title: `Partner ${id} | BYN-K`,
    description: 'View partner opportunities on BYN-K Platform',
  }
}

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  const { id } = await params
  const _partnerId = parseInt(id, 10)
  
  // Partners feature is not yet implemented in Django backend
  // Show a placeholder page

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Link */}
          <Link 
            href="/partners" 
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Partners
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Partner Logo Placeholder */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3 shadow-lg">
              <Building2 className="w-12 h-12 text-[#2D8FDD]" />
            </div>

            {/* Partner Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                Partner Details
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Partner profiles are managed through Django Admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Partner Feature Coming Soon
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Partner profiles and their opportunities will be available once configured in the Django Admin.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-[#2D8FDD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1E6BB8] transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
