/**
 * Django API Service
 * * Client for connecting to the Django REST Framework backend.
 */

import { Opportunity, OpportunityFilterParams, APIResponse } from '@/types'

// 1. Fixed: Use 127.0.0.1 and ensure no trailing slash here to prevent // bugs
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // endpoint should start with / so this becomes .../api/endpoint
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      // Add timeout for fetch during build time
      signal: AbortSignal.timeout(5000),
    })
    
    if (!response.ok) {
      // Helpful for debugging: logs the exact URL that failed
      console.error(`Fetch failed for ${url}: ${response.status}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    // Log but don't crash on network errors (e.g., during build)
    console.error(`API fetch error for ${url}:`, error)
    throw error
  }
}

/**
 * Build query string from filter parameters
 */
function buildQueryString(params: OpportunityFilterParams): string {
  const searchParams = new URLSearchParams()
  
  if (params.docs) searchParams.set('docs', params.docs)
  if (params.category) searchParams.set('category', params.category)
  if (params.location) searchParams.set('location', params.location)
  if (params.search) searchParams.set('search', params.search)
  if (params.is_verified !== undefined) {
    searchParams.set('is_verified', String(params.is_verified))
  }
  
  const query = searchParams.toString()
  // 3. Fixed: Added a slash before the ? because Django is strict
  return query ? `/?${query}` : '/'
}

// ============================================
// Opportunity Listings API
// ============================================

export async function getOpportunities(filters?: OpportunityFilterParams): Promise<APIResponse<Opportunity[]>> {
  try {
    const queryString = filters ? buildQueryString(filters) : '/'
    const response = await apiFetch<APIResponse<Opportunity[]>>(`/opportunities${queryString}`)
    return {
      ...response,
      data: (response as unknown as { results: Opportunity[] }).results || [],
    }
  } catch {
    // Return empty data when backend is unavailable (build time or dev without backend)
    return { data: [], disclaimer: '' }
  }
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  return apiFetch<Opportunity>(`/opportunities/${id}/`)
}

export async function getFeaturedOpportunities(): Promise<APIResponse<Opportunity[]>> {
  try {
    // 4. Fixed: Added trailing slash before query params
    const response = await apiFetch<APIResponse<Opportunity[]>>('/opportunities/?is_featured=true')
    return {
      ...response,
      data: (response as unknown as { results: Opportunity[] }).results || [],
    }
  } catch {
    // Return empty data when backend is unavailable (build time or dev without backend)
    return { data: [], disclaimer: '' }
  }
}



// ============================================
// Click Tracking, Analytics, Auth (Endpoints updated with slashes)
// ============================================

export async function trackClick(
  opportunityId: number,
  clickType: 'apply' | 'view_brochure' | 'compose_email' | 'view_details'
): Promise<{ success: boolean; click_count: number }> {
  return apiFetch('/track-click/', {
    method: 'POST',
    body: JSON.stringify({
      opportunity_id: opportunityId,
      click_type: clickType,
    }),
  })
}

export function getBrochureUrl(opportunityId: number): string {
  return `${API_BASE_URL}/opportunities/${opportunityId}/brochure/`
}

export interface AnalyticsOverview {
  [key: string]: unknown
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  try {
    return await apiFetch('/analytics/')
  } catch {
    // Return empty analytics when backend is unavailable
    return {}
  }
}

type AuthResponse = Record<string, unknown>
type AuthUser = Record<string, unknown>

export async function login(username: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function logout(): Promise<{ message: string }> {
  return apiFetch('/auth/logout/', {
    method: 'POST',
  })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>('/auth/me/')
  } catch {
    return null
  }
}

export async function register(data: Record<string, unknown>): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================
// Partner Management API
// ============================================
import { Partner } from '@/types';

export async function getPartners(): Promise<APIResponse<Partner[]>> {
  try {
    const response = await apiFetch<APIResponse<Partner[]>>('/partners/');
    return {
      ...response,
      data: (response as unknown as { results: Partner[] }).results || [],
    };
  } catch {
    // Return empty data when backend is unavailable (build time or dev without backend)
    return { data: [], disclaimer: '' };
  }
}

export async function createPartner(partnerData: Omit<Partner, 'id'>): Promise<Partner> {
  return apiFetch<Partner>('/partners/', {
    method: 'POST',
    body: JSON.stringify(partnerData),
  });
}

export async function updatePartner(id: number, partnerData: Partial<Partner>): Promise<Partner> {
  return apiFetch<Partner>(`/partners/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(partnerData),
  });
}

export async function deletePartner(id: number): Promise<void> {
  return apiFetch<void>(`/partners/${id}/`, {
    method: 'DELETE',
  });
}