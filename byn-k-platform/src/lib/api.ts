/**
 * Django API Service
 * Client for connecting to the Django REST Framework backend.
 */

import { Opportunity, OpportunityFilterParams, APIResponse } from '@/types'

// Ensure no trailing slash on the base URL to maintain predictable concatenation
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      // Abort if request takes longer than 10 seconds
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      console.error(`Fetch failed for ${url}: ${response.status}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API fetch error for ${url}:`, error);
    throw error;
  }
}

/**
 * Build query string from filter parameters
 */
function buildQueryString(params: OpportunityFilterParams): string {
  const searchParams = new URLSearchParams();
  
  if (params.docs) searchParams.set('docs', params.docs);
  if (params.category) searchParams.set('category', params.category);
  if (params.location) searchParams.set('location', params.location);
  if (params.search) searchParams.set('search', params.search);
  if (params.is_verified !== undefined) {
    searchParams.set('is_verified', String(params.is_verified));
  }
  
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// ============================================
// Opportunity Listings API
// ============================================

export async function getOpportunities(filters?: OpportunityFilterParams): Promise<APIResponse<Opportunity[]>> {
  try {
    const queryString = filters ? buildQueryString(filters) : '';
    // Django requires the trailing slash before the query parameters
    const response = await apiFetch<any>(`/opportunities/${queryString}`);
    
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0,
      next: response.next,
      previous: response.previous
    };
  } catch (error) {
    console.error("Failed to load opportunities:", error);
    return { data: [], disclaimer: '', count: 0 };
  }
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  // Direct detail endpoint always needs the trailing slash
  return apiFetch<Opportunity>(`/opportunities/${id}/`);
}

export async function getFeaturedOpportunities(): Promise<APIResponse<Opportunity[]>> {
  try {
    const response = await apiFetch<any>('/opportunities/?is_featured=true');
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0
    };
  } catch (error) {
    console.error("Failed to load featured opportunities:", error);
    return { data: [], disclaimer: '', count: 0 };
  }
}

// ============================================
// Click Tracking & Analytics
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
  });
}

export function getBrochureUrl(opportunityId: number): string {
  return `${API_BASE_URL}/opportunities/${opportunityId}/brochure/`;
}

export async function getAnalyticsOverview(): Promise<any> {
  try {
    return await apiFetch('/analytics/');
  } catch {
    return {};
  }
}

// ============================================
// Authentication
// ============================================

export async function login(username: string, password: string): Promise<any> {
  return apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function logout(): Promise<{ message: string }> {
  return apiFetch('/auth/logout/', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<{ id: number; username: string; email: string } | null> {
  try {
    return await apiFetch('/auth/me/');
  } catch {
    return null;
  }
}

// ============================================
// Partner Management
// ============================================

export async function getPartners(): Promise<APIResponse<any[]>> {
  try {
    const response = await apiFetch<any>('/partners/');
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0
    };
  } catch {
    return { data: [], disclaimer: '', count: 0 };
  }
}