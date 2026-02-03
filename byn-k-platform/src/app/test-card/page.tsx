'use client'

import React from 'react'
import { OpportunityCard } from '@/components/cards/OpportunityCard'

// Mock data demonstrating different application types
const mockOpportunities = [
  {
    id: '1',
    title: 'Office Manager',
    organizationName: 'Akili Dada',
    category: 'job' as const,
    documentation: ['alien_card', 'ctd', 'passport'],
    deadline: '2026-02-13T00:00:00Z',
    isVerified: true,
    location: 'Kenya',
    applicationType: 'pdf' as const,
    applyLink: 'https://example.com/apply',
    brochureUrl: '/test.pdf',
    prepChecklist: [
      { item: 'Resume', required: true },
      { item: 'Cover Letter', required: true },
      { item: 'Recommendation Letters', required: false, description: '2 letters preferred' },
    ],
  },
  {
    id: '2',
    title: 'Software Engineering Scholarship',
    organizationName: 'Mastercard Foundation',
    category: 'scholarship' as const,
    documentation: ['passport', 'national_id'],
    deadline: '2026-03-01T00:00:00Z',
    isVerified: true,
    location: 'Remote',
    applicationType: 'link' as const,
    applyLink: 'https://forms.office.com/scholarship',
    prepChecklist: [
      { item: 'Academic Transcripts', required: true },
      { item: 'Personal Statement', required: true },
      { item: 'Portfolio', required: false },
    ],
  },
  {
    id: '3',
    title: 'UX Design Internship',
    organizationName: 'RefuSHE Kenya',
    category: 'internship' as const,
    documentation: ['alien_card', 'waiting_slip'],
    deadline: '2026-02-20T00:00:00Z',
    isVerified: false,
    location: 'Uganda',
    applicationType: 'email' as const,
    applicationEmail: 'careers@refushe.org',
    emailSubjectLine: 'Application: UX Design Internship',
    prepChecklist: [
      { item: 'Design Portfolio', required: true },
      { item: 'CV', required: true },
    ],
  },
]

export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          OpportunityCard Component Test
        </h1>
        <p className="text-slate-600 mb-8">
          Testing the updated OpportunityCard with Django-compatible props, 
          Preparation Checklist, and conditional Action Buttons.
        </p>
        
        <div className="space-y-6">
          {/* PDF Application Type */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">
              1. PDF Brochure Type (app_type === &apos;pdf&apos;)
            </h2>
            <OpportunityCard {...mockOpportunities[0]} />
          </div>
          
          {/* Link Application Type */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">
              2. External Link Type (app_type === &apos;link&apos;)
            </h2>
            <OpportunityCard {...mockOpportunities[1]} />
          </div>
          
          {/* Email Application Type */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-3">
              3. Email Application Type (app_type === &apos;email&apos;)
            </h2>
            <OpportunityCard {...mockOpportunities[2]} />
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-2">Features Demonstrated:</h3>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>✓ &quot;WhatsApp Verified&quot; badge for verified opportunities</li>
            <li>✓ Location display with map pin icon</li>
            <li>✓ Preparation Checklist section showing required documents</li>
            <li>✓ Conditional Action Button based on application_type:</li>
            <ul className="ml-4">
              <li>- &quot;View Brochure&quot; for PDF type</li>
              <li>- &quot;Apply on Official Site&quot; for link type</li>
              <li>- &quot;Compose Application Email&quot; for email type</li>
            </ul>
            <li>✓ Documentation/ID badges (Alien Card, CTD, Passport, etc.)</li>
            <li>✓ Days remaining countdown with deadline warning</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
