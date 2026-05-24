import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Target,
  Wallet,
} from 'lucide-react'
import OpportunityActions from '@/components/ui/OpportunityActions'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { getOpportunityBySlug } from '@/lib/api'
import {
  applicationTypeLabels,
  commitmentLabels,
  documentTypeLabels,
  educationLevelLabels,
  fundingTypeLabels,
  targetGroupLabels,
  workModeLabels,
} from '@/types'
import type { Opportunity } from '@/types'

function formatDate(value?: string | null): string {
  if (!value) return 'Rolling deadline'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getApplyUrl(opportunity: Opportunity): { href: string; isEmail: boolean; disabled: boolean } {
  if (opportunity.application_type === 'email' && opportunity.application_email) {
    const subject = opportunity.email_subject_line || `Application: ${opportunity.title}`
    return {
      href: `mailto:${opportunity.application_email}?subject=${encodeURIComponent(subject)}`,
      isEmail: true,
      disabled: false,
    }
  }

  if (opportunity.application_type === 'pdf' && opportunity.brochure_url) {
    return { href: opportunity.brochure_url, isEmail: false, disabled: false }
  }

  if (opportunity.external_url && /^https?:\/\//i.test(opportunity.external_url)) {
    return { href: opportunity.external_url, isEmail: false, disabled: false }
  }

  return { href: '#application-details', isEmail: false, disabled: true }
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value?: string | null
  icon?: ComponentType<{ size?: number; className?: string }>
}) {
  if (!value) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {Icon && <Icon size={15} className="text-primary" />}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</dd>
    </div>
  )
}

function formatFunding(opportunity: Opportunity): string | null {
  if (opportunity.funding_type) {
    return fundingTypeLabels[opportunity.funding_type]
  }

  if (opportunity.is_paid === true) return 'Paid'
  if (opportunity.is_paid === false) return 'Unpaid'
  return null
}

function formatStipend(opportunity: Opportunity): string | null {
  if (opportunity.stipend_min && opportunity.stipend_max) {
    return `${opportunity.stipend_min} - ${opportunity.stipend_max}`
  }
  return opportunity.stipend_min || opportunity.stipend_max || null
}

function getDeadlineStatus(opportunity: Opportunity): { label: string; className: string } {
  if (opportunity.is_expired) {
    return {
      label: 'Deadline passed',
      className: 'border-red-200 bg-red-50 text-red-700',
    }
  }

  if (opportunity.is_rolling || !opportunity.deadline) {
    return {
      label: 'Rolling deadline',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    }
  }

  if (
    typeof opportunity.days_until_deadline === 'number' &&
    opportunity.days_until_deadline >= 0 &&
    opportunity.days_until_deadline <= 7
  ) {
    return {
      label: `${opportunity.days_until_deadline} day${opportunity.days_until_deadline === 1 ? '' : 's'} left`,
      className: 'border-amber-200 bg-amber-50 text-amber-800',
    }
  }

  return {
    label: formatDate(opportunity.deadline),
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  }
}

export async function OpportunityDetail({ slug }: { slug: string }) {
  let opportunity: Opportunity

  try {
    opportunity = await getOpportunityBySlug(slug)
  } catch {
    notFound()
  }

  const apply = getApplyUrl(opportunity)
  const documents = opportunity.required_documents || []
  const checklist = opportunity.prep_checklist || []
  const category = opportunity.category || 'job'
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)
  const deadlineStatus = getDeadlineStatus(opportunity)
  const stipend = formatStipend(opportunity)
  const funding = formatFunding(opportunity)
  const location = opportunity.city || opportunity.location || 'Remote'

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-hero-dark text-on-dark">
        <div className="byn-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/opportunities"
            className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-muted-on-dark transition-colors hover:text-link-on-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-dark"
          >
            <ArrowLeft size={18} />
            Back to opportunities
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-light">
                  {categoryLabel}
                </span>
                {opportunity.is_verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${deadlineStatus.className}`}>
                  <Calendar size={14} />
                  {deadlineStatus.label}
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-normal sm:text-4xl lg:text-5xl">
                {opportunity.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-on-dark">
                <span className="inline-flex items-center gap-2">
                  <OrganizationLogo
                    logoUrl={opportunity.org_logo_url}
                    organizationName={opportunity.organization_name}
                    size="sm"
                  />
                  {opportunity.organization_name}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(opportunity.deadline)}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border-on-dark/70 bg-glass-on-dark p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">Application route</p>
              <p className="mt-2 text-lg font-black text-on-dark">
                {applicationTypeLabels[opportunity.application_type] || 'Application details'}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-on-dark">
                Review the requirements below before applying. Save this listing if you need time to prepare your documents.
              </p>
              {apply.disabled && (
                <p className="mt-4 flex gap-2 rounded-lg border border-amber-200/50 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  Application details are still being verified. Use the checklist and confirm the official source before applying.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Opportunity brief</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Overview</h2>
              <div className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {opportunity.description_en || opportunity.description_sw || opportunity.description_fr || 'No description has been provided yet.'}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <section>
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <FileText size={20} className="text-primary" />
                  Required Documents
                </h2>
                {documents.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {documents.map((document) => (
                      <span key={document} className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm font-semibold text-slate-800">
                        {documentTypeLabels[document] || document.replaceAll('_', ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    Document requirements are not listed yet. Confirm accepted documents before applying.
                  </p>
                )}
              </section>

              <section id="application-details" className="mt-8">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  Preparation Checklist
                </h2>
                {checklist.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {checklist.map((item) => (
                      <div key={item.item} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <CheckCircle2 className="mt-0.5 text-emerald-600" size={18} />
                        <div>
                          <p className="font-semibold text-slate-900">{item.item}</p>
                          {item.description && <p className="mt-1 text-sm text-slate-600">{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    No checklist has been added for this listing. Prepare your CV, identification documents, and any certificates relevant to the opportunity.
                  </p>
                )}
              </section>
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">At a glance</p>
              <dl className="mt-4 grid gap-3">
                <DetailRow label="Location" value={location} icon={MapPin} />
                <DetailRow label="Deadline" value={deadlineStatus.label} icon={Calendar} />
                <DetailRow label="Work mode" value={opportunity.work_mode ? workModeLabels[opportunity.work_mode] : null} icon={BriefcaseBusiness} />
                <DetailRow label="Commitment" value={opportunity.commitment ? commitmentLabels[opportunity.commitment] : null} icon={Target} />
                <DetailRow label="Funding" value={funding} icon={Wallet} />
                <DetailRow label="Stipend" value={stipend} icon={Wallet} />
                <DetailRow label="Target group" value={opportunity.target_group ? targetGroupLabels[opportunity.target_group] : null} icon={Target} />
                <DetailRow
                  label="Education level"
                  value={opportunity.education_level ? educationLevelLabels[opportunity.education_level] : null}
                  icon={BookOpen}
                />
              </dl>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <GraduationCap size={18} className="text-primary" />
                Refugee-document aware
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This listing is curated for Banyamulenge youth and highlights document requirements where available.
              </p>
            </div>

            {opportunity.disclaimer && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                  <AlertTriangle size={18} />
                  Listing note
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  {opportunity.disclaimer}
                </p>
              </div>
            )}
          </aside>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <OpportunityActions
            opportunityId={String(opportunity.id)}
            title={opportunity.title}
            organizationName={opportunity.organization_name}
            category={opportunity.category}
            slug={opportunity.slug}
            applyUrl={apply.href}
            isEmailApplication={apply.isEmail}
          />
          </div>
        </div>
      </section>
    </main>
  )
}
