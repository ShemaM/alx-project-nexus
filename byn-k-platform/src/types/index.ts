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



// Filter parameters for opportunity listings

export interface OpportunityFilterParams {

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