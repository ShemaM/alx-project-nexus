/**
 * Django API Service
 * 
 * Client for connecting to the Django REST Framework backend.
 * This replaces the Payload CMS data layer.
 */

import { Job, JobFilterParams, APIResponse, ClickAnalytics, transformJobToOpportunityCard, OpportunityCardProps } from '@/types'

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include session cookies
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Build query string from filter parameters
 */
function buildQueryString(params: JobFilterParams): string {
  const searchParams = new URLSearchParams()
  
  if (params.docs) searchParams.set('docs', params.docs)
  if (params.category) searchParams.set('category', params.category)
  if (params.location) searchParams.set('location', params.location)
  if (params.search) searchParams.set('search', params.search)
  if (params.is_verified !== undefined) {
    searchParams.set('is_verified', String(params.is_verified))
  }
  
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

// ============================================
// Job Listings API
// ============================================

/**
 * Fetch all active job listings
 */
export async function getJobs(filters?: JobFilterParams): Promise<APIResponse<Job[]>> {
  const queryString = filters ? buildQueryString(filters) : ''
  return apiFetch<APIResponse<Job[]>>(`/jobs/${queryString}`)
}

/**
 * Fetch a single job by ID
 */
export async function getJobById(id: number): Promise<Job> {
  return apiFetch<Job>(`/jobs/${id}/`)
}

/**
 * Fetch featured jobs for hero carousel
 */
export async function getFeaturedJobs(): Promise<APIResponse<Job[]>> {
  return apiFetch<APIResponse<Job[]>>('/jobs/featured/')
}

/**
 * Get jobs as OpportunityCardProps (for frontend components)
 */
export async function getOpportunitiesFromDjango(
  filters?: JobFilterParams
): Promise<OpportunityCardProps[]> {
  try {
    const response = await getJobs(filters)
    const jobs = response.data || (response as unknown as { results: Job[] }).results || []
    return jobs.map(transformJobToOpportunityCard)
  } catch (error) {
    console.error('Failed to fetch opportunities from Django:', error)
    return []
  }
}

// ============================================
// Click Tracking API
// ============================================

/**
 * Track a user click/redirect
 */
export async function trackClick(
  jobId: number,
  clickType: 'apply' | 'view_brochure' | 'compose_email' | 'view_details'
): Promise<{ success: boolean; click_count: number }> {
  return apiFetch('/track-click/', {
    method: 'POST',
    body: JSON.stringify({
      job_id: jobId,
      click_type: clickType,
    }),
  })
}

// ============================================
// Brochure API
// ============================================

/**
 * Get protected brochure URL
 */
export function getBrochureUrl(jobId: number): string {
  return `${API_BASE_URL}/jobs/${jobId}/brochure/`
}

// ============================================
// Analytics API (Admin only)
// ============================================

/**
 * Fetch analytics overview (admin only)
 */
export async function getAnalyticsOverview(): Promise<{
  total_jobs: number
  verified_jobs: number
  featured_jobs: number
  top_clicked: Array<{
    id: number
    title: string
    organization: string
    total_clicks: number
  }>
  disclaimer: string
}> {
  return apiFetch('/analytics/')
}

// ============================================
// Auth API
// ============================================

/**
 * Login user
 */
export async function login(username: string, password: string): Promise<{
  id: number
  username: string
  email: string
  is_admin: boolean
}> {
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

/**
 * Logout user
 */
export async function logout(): Promise<{ message: string }> {
  return apiFetch('/auth/logout/', {
    method: 'POST',
  })
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{
  id: number
  username: string
  email: string
  is_admin: boolean
} | null> {
  try {
    return await apiFetch('/auth/me/')
  } catch {
    return null
  }
}

/**
 * Register new user
 */
export async function register(data: {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}): Promise<{
  id: number
  username: string
  email: string
}> {
  return apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
