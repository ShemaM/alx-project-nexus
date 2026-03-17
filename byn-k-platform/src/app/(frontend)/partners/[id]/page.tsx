import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, Briefcase, Globe } from 'lucide-react'
import { getPartnerById, getOpportunities } from '@/lib/api'
import { getSafePartnerLogoSrc } from '@/lib/partner-utils'
import { buildOpportunityPath } from '@/lib/opportunity-utils'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { PageStatusTracker, type PageStatus } from '@/components/ui/PageStatusTracker'
import { workModeLabels } from '@/types'
import type { Opportunity, Partner } from '@/types'

// Limit results to keep the partner detail view performant and focused.
const JOB_LIMIT = 6

interface PartnerPageProps {
  params: { id: string }
}

export const revalidate = 60

export async function generateMetadata({ params }: PartnerPageProps) {
  const partnerId = Number(params.id)
  const partner = await getPartnerById(partnerId)
  return {
    title: partner ? `${partner.name} | Partner Details` : `Partner ${params.id} | BYN-K`,
    description:
      partner?.description ||
      'Explore the partner profile and verified opportunities curated for Banyamulenge youth.',
  }
}

// Cozy helper to format deadline strings for job cards.
const formatDate = (value?: string | null) => {
  if (!value) return 'Deadline TBD'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Deadline TBD'
  return Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

// Derive the location/work-mode label for opportunity cards.
const getLocationLabel = (job: Opportunity) =>
  job.city ||
  job.location ||
  (job.work_mode ? workModeLabels[job.work_mode] : undefined) ||
  'Remote / Hybrid'

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  // Fetch partner metadata + recent jobs to render the detail experience.
  const partnerId = Number(params.id)
  const [partner, opportunitiesResponse] = await Promise.all([
    getPartnerById(partnerId),
    getOpportunities({ partner: partnerId, page_size: JOB_LIMIT, ordering: '-deadline' }),
  ])

  const pageStatus: PageStatus = partner ? 'loaded' : 'error'
  const jobListings = opportunitiesResponse.data || []

  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <PageStatusTracker status={pageStatus} />
        <Container className="py-20">
          <Card className="border border-error bg-error-bg text-error space-y-4">
            <p className="text-lg font-semibold">Partner not found</p>
            <p className="text-sm text-error">
              We could not locate that partner or the profile is unavailable right now. Please try again later.
            </p>
            <Button variant="secondary" size="sm" href="/partners">
              Back to Partners
            </Button>
          </Card>
        </Container>
        <Footer />
      </div>
    )
  }

  const safeLogo = getSafePartnerLogoSrc(partner.logo_url || partner.logo)
  const opportunityCount = partner.opportunity_count ?? jobListings.length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <PageStatusTracker status={pageStatus} />

      <section className="bg-gradient-to-br from-[#2D8FDD] via-[#1E6BB8] to-[#2D8FDD] py-12 md:py-16 text-white">
        <Container>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Partners
          </Link>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="w-28 h-28 rounded-3xl bg-white/20 flex items-center justify-center overflow-hidden shadow-lg">
              {safeLogo ? (
                <Image
                  src={safeLogo}
                  alt={`${partner.name} logo`}
                  width={112}
                  height={112}
                  className="object-contain w-full h-full"
                />
              ) : (
                <Building2 className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-xs uppercase tracking-[0.5em] text-blue-100">Partner Details</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{partner.name}</h1>
              <p className="body-md text-white/90 max-w-3xl">
                {partner.description ||
                  'This partner is part of our verified network of organizations dedicated to supporting Banyamulenge youth.'}
              </p>
              <div className="flex flex-wrap gap-3">
                {partner.website_url && (
                  <Button
                    variant="secondary"
                    size="sm"
                    href={partner.website_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe size={16} />
                    Visit website
                  </Button>
                )}
                <Button variant="primary" size="sm" href="#jobs">
                  View current opportunities
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="mt-10 grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.4em]">
            <ShieldCheck size={12} />
            Verified partner
          </div>
          <p className="text-3xl font-bold text-slate-900">{opportunityCount}</p>
          <p className="body-sm text-slate-600">Opportunities shared with Banyamulenge youth.</p>
        </Card>
        <Card className="space-y-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.4em]">
            <Globe size={14} />
            Website
          </div>
          {partner.website_url ? (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noreferrer"
              className="body-md text-primary-600 hover:underline"
            >
              {partner.website_url}
            </a>
          ) : (
            <p className="body-sm text-slate-500">Website information will appear here once available.</p>
          )}
        </Card>
        <Card className="space-y-2 text-slate-700">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-500">
            <Briefcase size={12} />
            Job listings
          </div>
          <p className="heading-lg text-slate-900">{jobListings.length}</p>
          <p className="body-sm text-slate-500">
            Updated hourly as soon as the partner publishes verified opportunities.
          </p>
        </Card>
      </Container>

      <Container className="mt-12" id="jobs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Opportunities</p>
            <h2 className="heading-lg text-slate-900 mt-1">Active job listings</h2>
          </div>
          <Link
            href={`/opportunities?partner=${partnerId}`}
            className="text-primary-600 font-semibold hover:underline"
          >
            Browse all opportunities <ArrowRight size={14} />
          </Link>
        </div>
        {jobListings.length === 0 ? (
          <Card className="mt-8 space-y-4 border-dashed border-slate-200 text-center bg-white">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Briefcase size={20} className="text-[#2D8FDD]" />
            </div>
            <p className="heading-md">No active listings yet</p>
            <p className="body-md text-slate-500">
              This partner has not shared any opportunities recently. Check back later or explore other partners.
            </p>
            <Button variant="secondary" size="sm" href="/opportunities">
              Browse all opportunities
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 mt-8 lg:grid-cols-2">
            {jobListings.map((job: Opportunity) => (
              <Card key={job.id} className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.4em] text-slate-500">
                      {job.category ? job.category.replace(/^\w/, (c: string) => c.toUpperCase()) : 'Opportunity'}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900 mt-2">{job.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500">{formatDate(job.deadline)}</p>
                </div>
                <p className="body-sm text-slate-600">{getLocationLabel(job)}</p>
                <div className="flex flex-wrap gap-2">
                  {job.is_verified && (
                    <span className="status-badge">Verified</span>
                  )}
                  {job.is_active && (
                    <span className="status-badge status-badge--success">Active now</span>
                  )}
                  {job.is_featured && (
                    <span className="status-badge status-badge--info">Featured</span>
                  )}
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    href={buildOpportunityPath(job.category, job.slug)}
                  >
                    View job details
                  </Button>
                  {job.external_url ? (
                    <a
                      href={job.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-primary-600 inline-flex items-center gap-1"
                    >
                      Apply on partner site <ArrowRight size={14} />
                    </a>
                  ) : (
                    <span className="text-sm text-slate-500">Apply information available on details page.</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>

      <Footer />
    </div>
  )
}
