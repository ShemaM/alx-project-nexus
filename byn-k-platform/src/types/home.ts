/** Shape for featured cards surfaced on the homepage hero/highlights. */
export interface FeaturedOpportunity {
  id: string
  title: string
  organization: string
  category: 'job' | 'scholarship' | 'internship' | 'fellowship' | 'training'
  deadline: string
  isHot?: boolean
  slug?: string
}

export type CategoryCounts = {
  jobs: number
  scholarships: number
  internships: number
  fellowships: number
  training: number
  partners?: number
}
