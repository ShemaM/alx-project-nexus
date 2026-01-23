import React from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, Calendar, CheckCircle2, ExternalLink, MapPin, Building2, FileText, Share2 } from 'lucide-react'

// Sample opportunity data (would be fetched from Payload CMS in production)
const getOpportunityById = (id: string) => {
  const opportunities = [
    {
      id: '1',
      title: 'Junior Software Developer',
      organizationName: 'Tech Solutions Kenya',
      category: 'job',
      documentation: ['alien_card', 'passport'],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true,
      applyLink: '#',
      location: 'Nairobi, Kenya',
      description: `We are looking for a motivated Junior Software Developer to join our team. You will work on exciting projects using modern technologies.\n\nRequirements:\n- Basic knowledge of JavaScript/TypeScript\n- Understanding of React or similar frameworks\n- Good problem-solving skills\n- Ability to work in a team\n\nBenefits:\n- Competitive salary\n- Remote work options\n- Professional development opportunities`,
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'DAFI Scholarship 2025',
      organizationName: 'UNHCR',
      category: 'scholarship',
      documentation: ['alien_card', 'ctd'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true,
      applyLink: '#',
      location: 'Kenya',
      description: `The DAFI (Albert Einstein German Academic Refugee Initiative) scholarship provides higher education opportunities to refugees.\n\nEligibility:\n- Must be a registered refugee\n- Strong academic record\n- Demonstrated financial need\n\nBenefits:\n- Full tuition coverage\n- Monthly stipend\n- Learning materials allowance`,
      postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Digital Marketing Internship',
      organizationName: 'Growth Agency',
      category: 'internship',
      documentation: ['passport', 'alien_card'],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: false,
      applyLink: '#',
      location: 'Remote',
      description: `Exciting internship opportunity in digital marketing. Learn hands-on skills in SEO, social media marketing, and content creation.\n\nDuration: 3 months\nType: Part-time/Full-time\n\nWhat you'll learn:\n- Social media management\n- Content marketing strategies\n- Analytics and reporting`,
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      title: 'Coding Bootcamp Training',
      organizationName: 'ALX Africa',
      category: 'training',
      documentation: ['alien_card', 'ctd', 'passport'],
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      isVerified: true,
      applyLink: '#',
      location: 'Nairobi / Online',
      description: `Join ALX Africa's intensive coding bootcamp and transform your career in tech.\n\nProgram Highlights:\n- 12-month comprehensive training\n- Industry-relevant curriculum\n- Mentorship from tech professionals\n- Job placement support\n\nNo prior coding experience required!`,
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  return opportunities.find(opp => opp.id === id)
}

// Helper function to calculate days remaining
const getDaysRemaining = (deadline: string) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get category label color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'job':
      return 'text-[#F5A623] bg-orange-50 border-orange-200'
    case 'scholarship':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'internship':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'training':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { id } = await params
  const opportunity = getOpportunityById(id)

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Opportunity Not Found</h1>
          <p className="text-slate-600 mb-8">The opportunity you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#0F4C81] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d3f6b] transition-colors">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const daysRemaining = getDaysRemaining(opportunity.deadline)
  const categoryColorClass = getCategoryColor(opportunity.category)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0F4C81] hover:text-[#0d3f6b] font-medium transition-colors">
            <ArrowLeft size={18} />
            Back to Opportunities
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase border ${categoryColorClass}`}>
                {opportunity.category}
              </span>
              {opportunity.isVerified && (
                <div className="flex items-center gap-1 bg-emerald-50 text-[#27AE60] px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
                  <CheckCircle2 size={14} />
                  Verified
                </div>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F4C81] mb-4">
              {opportunity.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-slate-400" />
                <span className="font-medium">{opportunity.organizationName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-slate-400" />
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-8 bg-slate-50 border-b border-[#E2E8F0]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Deadline</p>
                <p className={`font-semibold ${daysRemaining <= 7 ? 'text-[#F5A623]' : 'text-slate-900'}`}>
                  {formatDate(opportunity.deadline)}
                </p>
                <p className={`text-sm ${daysRemaining <= 7 ? 'text-[#F5A623]' : 'text-slate-500'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Deadline passed'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Accepted Documents</p>
                <div className="flex flex-wrap gap-1">
                  {opportunity.documentation.map((doc) => (
                    <span 
                      key={doc}
                      className="bg-white text-[#0F4C81] border border-[#0F4C81]/20 px-2 py-0.5 rounded text-xs font-medium"
                    >
                      {doc.replace('_', ' ').toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#0F4C81]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Posted</p>
                <p className="font-semibold text-slate-900">
                  {formatDate(opportunity.postedDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">About this opportunity</h2>
            <div className="prose prose-slate max-w-none">
              {opportunity.description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 mb-4 last:mb-0 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 md:p-8 border-t border-[#E2E8F0] bg-slate-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#0F4C81] hover:bg-[#0d3f6b] text-white px-6 py-4 rounded-xl font-bold text-base transition-colors"
              >
                Apply Now <ExternalLink size={18} />
              </a>
              <button 
                className="flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-xl font-bold text-base transition-colors"
                aria-label="Share opportunity"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
