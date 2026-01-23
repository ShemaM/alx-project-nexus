export interface OpportunityCardProps {
  title: string
  organizationName: string
  category: 'jobs' | 'scholarships' | 'internships' | 'fellowships'
  documentation: string[]
  deadline: string
  isVerified: boolean
  applyLink: string
}