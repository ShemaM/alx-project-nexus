// Document types for required_documents field
export type DocumentType = 
  | 'alien_card' 
  | 'ctd' 
  | 'passport' 
  | 'waiting_slip' 
  | 'any_id' 
  | 'not_specified'
  | 'national_id'
  | 'work_permit'
  | 'birth_certificate'

// Application types matching Django backend
export type ApplicationType = 'link' | 'email' | 'pdf'

// Opportunity category types
export type OpportunityCategory = 'job' | 'scholarship' | 'internship' | 'training' | 'fellowship'

// Preparation checklist item
export interface PrepChecklistItem {
  item: string
  description?: string
  required?: boolean
}

// Django Job model interface (matches backend)
export interface Job {
  id: number
  title: string
  organization_name: string
  location?: string | null
  category?: OpportunityCategory
  required_documents: DocumentType[]
  application_type: ApplicationType
  external_url?: string | null
  application_email?: string | null
  email_subject_line?: string | null
  brochure_url?: string | null
  prep_checklist: PrepChecklistItem[]
  is_verified: boolean
  deadline?: string | null
  created_at: string
  updated_at: string
  disclaimer?: string
}

// OpportunityCard props matching Django Job model
export interface OpportunityCardProps {
  id?: string | number
  slug?: string
  title: string
  organizationName: string  // maps to organization_name
  category: OpportunityCategory
  documentation: DocumentType[]  // maps to required_documents
  deadline: string
  isVerified: boolean  // maps to is_verified
  location?: string | null
  // Application method fields
  applicationType: ApplicationType  // maps to application_type
  applyLink?: string | null  // maps to external_url
  applicationEmail?: string | null  // maps to application_email
  emailSubjectLine?: string | null  // maps to email_subject_line
  brochureUrl?: string | null  // maps to brochure_url
  // Preparation checklist
  prepChecklist?: PrepChecklistItem[]  // maps to prep_checklist
  // Deprecated fields (for backward compatibility)
  requiredDocuments?: string | null
  descriptionType?: 'text' | 'document'
  opportunityDocumentUrl?: string | null
}

// API Response wrapper with disclaimer
export interface APIResponse<T> {
  data: T
  disclaimer: string
  total_count?: number
  page?: number
  page_size?: number
}

// Filter parameters for job listings
export interface JobFilterParams {
  docs?: DocumentType
  category?: OpportunityCategory
  location?: string
  search?: string
  is_verified?: boolean
}

// Analytics data for click tracking
export interface ClickAnalytics {
  job_id: number
  click_type: 'apply' | 'view_brochure' | 'compose_email'
  timestamp: string
}

// Utility function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Transform Django Job to OpportunityCardProps
export const transformJobToOpportunityCard = (job: Job): OpportunityCardProps => {
  return {
    id: job.id,
    slug: generateSlug(job.title),
    title: job.title,
    organizationName: job.organization_name,
    category: job.category || 'job',
    documentation: job.required_documents || [],
    deadline: job.deadline || new Date().toISOString(),
    isVerified: job.is_verified,
    location: job.location,
    applicationType: job.application_type,
    applyLink: job.external_url,
    applicationEmail: job.application_email,
    emailSubjectLine: job.email_subject_line,
    brochureUrl: job.brochure_url,
    prepChecklist: job.prep_checklist || [],
  }
}

// Document type labels for display
export const documentTypeLabels: Record<DocumentType, string> = {
  alien_card: 'Alien Card',
  ctd: 'CTD',
  passport: 'Passport',
  waiting_slip: 'Waiting Slip',
  any_id: 'Any ID',
  not_specified: 'Not Specified',
  national_id: 'National ID',
  work_permit: 'Work Permit',
  birth_certificate: 'Birth Certificate',
}

// Application type labels for display
export const applicationTypeLabels: Record<ApplicationType, string> = {
  link: 'Apply on Official Site',
  email: 'Compose Application Email',
  pdf: 'View Brochure',
}