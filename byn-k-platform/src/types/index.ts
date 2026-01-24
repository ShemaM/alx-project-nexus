export interface OpportunityCardProps {
  id?: string
  slug?: string
  title: string
  organizationName: string
  category: 'job' | 'scholarship' | 'internship' | 'training' | 'fellowship'
  documentation: string[]
  deadline: string
  isVerified: boolean
  applyLink: string
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