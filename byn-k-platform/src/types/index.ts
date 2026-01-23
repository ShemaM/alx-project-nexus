export interface OpportunityCardProps {
  id?: string
  title: string
  organizationName: string
  category: 'job' | 'scholarship' | 'internship' | 'training'
  documentation: string[]
  deadline: string
  isVerified: boolean
  applyLink: string
}