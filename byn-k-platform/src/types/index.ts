/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Work mode types (Filter Parity)
export type WorkMode = 'remote' | 'hybrid' | 'onsite'

// Commitment types (Filter Parity)
export type Commitment = 'full_time' | 'part_time' | 'short_term' | 'long_term'

// Target group types (Filter Parity)
export type TargetGroup = 'refugees' | 'youth' | 'women' | 'all'

// Education level types (Filter Parity)
export type EducationLevel = 'high_school' | 'undergraduate' | 'graduate' | 'any'

// Funding type (Filter Parity)
export type FundingType = 'fully' | 'partially' | 'none'

// Preparation checklist item
export interface PrepChecklistItem {
  item: string
  description?: string
  required?: boolean
}

// Django Opportunity model interface (matches backend)
export interface Opportunity {
  organization: any
  id: number
  title: string
  organization_name: string
  location?: string | null
  city?: string | null
  category?: OpportunityCategory
  // Work mode & commitment
  work_mode?: WorkMode | null
  commitment?: Commitment | null
  // Eligibility
  target_group?: TargetGroup | null
  education_level?: EducationLevel | null
  // Funding
  funding_type?: FundingType | null
  is_paid?: boolean
  stipend_min?: string | null
  stipend_max?: string | null
  // Documents
  required_documents: DocumentType[]
  // Application
  application_type: ApplicationType
  external_url?: string | null
  application_email?: string | null
  email_subject_line?: string | null
  brochure_url?: string | null
  prep_checklist: PrepChecklistItem[]
  // Status
  is_verified: boolean
  // Deadline
  deadline?: string | null
  is_rolling?: boolean
  // Computed
  days_until_deadline?: number | null
  is_expired?: boolean
  // Metadata
  created_at: string
  updated_at: string
  disclaimer?: string
}

// Partner interface
export interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string | null;
}

// API Response wrapper with metadata for pagination
export interface APIResponse<T> {
  data: T
  disclaimer: string
  count?: number       // Changed from total_count to match Django
  next?: string | null     // Added for pagination
  previous?: string | null // Added for pagination
  page?: number
  page_size?: number
}



// Filter parameters for opportunity listings (Filter Parity with Backend)

export interface OpportunityFilterParams {
  // Document filter
  docs?: DocumentType
  // Category
  category?: OpportunityCategory
  // Location
  location?: string
  city?: string
  // Work mode & commitment
  work_mode?: WorkMode
  commitment?: Commitment
  // Eligibility
  target_group?: TargetGroup
  education_level?: EducationLevel
  // Funding
  funding_type?: FundingType
  is_paid?: boolean
  stipend_min?: number
  stipend_max?: number
  // Deadline intelligence
  deadline_before?: string
  deadline_after?: string
  closing_soon?: boolean
  is_rolling?: boolean
  // Status
  is_verified?: boolean
  is_active?: boolean
  is_featured?: boolean
  // Search & sort
  search?: string
  ordering?: 'deadline' | '-deadline' | 'created_at' | '-created_at' | 'title' | '-title'
}



// Analytics data for click tracking

export interface ClickAnalytics {

  job_id: number

  click_type: 'apply' | 'view_brochure' | 'compose_email'

  timestamp: string

}



// Subscription interfaces

export interface Subscription {
  id: number
  email: string
  is_active: boolean
  created_at: string
  confirmed_at?: string | null
}

export interface SubscriptionResponse {
  success: boolean
  message: string
  status: 'pending_confirmation' | 'already_subscribed' | 'confirmed' | 'already_confirmed' | 'unsubscribed' | 'already_unsubscribed'
}



// Utility function to generate a slug from a title

export const generateSlug = (title: string): string => {

  return title

    .toLowerCase()

    .replaceAll(/[^a-z0-9\s-]/g, '') // Remove special characters

    .replaceAll(/\s+/g, '-') // Replace spaces with hyphens

    .replaceAll(/-+/g, '-') // Replace multiple hyphens with single hyphen

    .trim()

    .replaceAll(/(?:^-+)|(?:-+$)/g, '') // Remove leading/trailing hyphens

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

// Work mode labels for display
export const workModeLabels: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

// Commitment labels for display
export const commitmentLabels: Record<Commitment, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  short_term: 'Short-term',
  long_term: 'Long-term',
}

// Target group labels for display
export const targetGroupLabels: Record<TargetGroup, string> = {
  refugees: 'Refugees',
  youth: 'Youth',
  women: 'Women',
  all: 'All',
}

// Education level labels for display
export const educationLevelLabels: Record<EducationLevel, string> = {
  high_school: 'High School',
  undergraduate: 'Undergraduate',
  graduate: 'Graduate',
  any: 'Any Level',
}

// Funding type labels for display
export const fundingTypeLabels: Record<FundingType, string> = {
  fully: 'Fully Funded',
  partially: 'Partially Funded',
  none: 'Not Funded',
}