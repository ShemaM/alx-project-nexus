/**
 * Django API Service
 * Client for connecting to the Django REST Framework backend.
 */

import { Opportunity, OpportunityFilterParams, APIResponse, SubscriptionResponse } from '@/types'

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
 * Supports all filter parity parameters between backend and frontend
 */
function buildQueryString(params: OpportunityFilterParams): string {
  const searchParams = new URLSearchParams();
  
  // Document filter
  if (params.docs) searchParams.set('docs', params.docs);
  // Category
  if (params.category) searchParams.set('category', params.category);
  // Location
  if (params.location) searchParams.set('location', params.location);
  if (params.city) searchParams.set('city', params.city);
  // Work mode & commitment
  if (params.work_mode) searchParams.set('work_mode', params.work_mode);
  if (params.commitment) searchParams.set('commitment', params.commitment);
  // Eligibility
  if (params.target_group) searchParams.set('target_group', params.target_group);
  if (params.education_level) searchParams.set('education_level', params.education_level);
  // Funding
  if (params.funding_type) searchParams.set('funding_type', params.funding_type);
  if (params.is_paid !== undefined) searchParams.set('is_paid', String(params.is_paid));
  if (params.stipend_min !== undefined) searchParams.set('stipend_min', String(params.stipend_min));
  if (params.stipend_max !== undefined) searchParams.set('stipend_max', String(params.stipend_max));
  // Deadline intelligence
  if (params.deadline_before) searchParams.set('deadline_before', params.deadline_before);
  if (params.deadline_after) searchParams.set('deadline_after', params.deadline_after);
  if (params.closing_soon !== undefined) searchParams.set('closing_soon', String(params.closing_soon));
  if (params.is_rolling !== undefined) searchParams.set('is_rolling', String(params.is_rolling));
  // Status
  if (params.is_verified !== undefined) searchParams.set('is_verified', String(params.is_verified));
  if (params.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
  if (params.is_featured !== undefined) searchParams.set('is_featured', String(params.is_featured));
  // Search & sort
  if (params.search) searchParams.set('search', params.search);
  if (params.ordering) searchParams.set('ordering', params.ordering);
  
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

/**
 * Get opportunity by slug (SEO-friendly URL)
 * @param slug - The URL-friendly slug of the opportunity
 * @returns Opportunity data
 */
export async function getOpportunityBySlug(slug: string): Promise<Opportunity> {
  return apiFetch<Opportunity>(`/opportunities/${slug}/`);
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

// ============================================
// Email Subscription
// ============================================

/**
 * Create a new email subscription
 * @param email - The email address to subscribe
 * @returns SubscriptionResponse with success status and message
 */
export async function subscribe(email: string): Promise<SubscriptionResponse> {
  try {
    return await apiFetch<SubscriptionResponse>('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.',
      status: 'pending_confirmation',
    };
  }
}

/**
 * Confirm an email subscription using the token
 * @param token - The confirmation token from the email
 * @returns SubscriptionResponse with confirmation status
 */
export async function confirmSubscription(token: string): Promise<SubscriptionResponse> {
  try {
    return await apiFetch<SubscriptionResponse>(`/subscriptions/confirm/${token}/`);
  } catch (error) {
    console.error('Confirmation error:', error);
    return {
      success: false,
      message: 'Invalid or expired confirmation link.',
      status: 'pending_confirmation',
    };
  }
}

/**
 * Unsubscribe from email notifications using the token
 * @param token - The unsubscribe token from the email
 * @returns SubscriptionResponse with unsubscription status
 */
export async function unsubscribe(token: string): Promise<SubscriptionResponse> {
  try {
    return await apiFetch<SubscriptionResponse>(`/subscriptions/unsubscribe/${token}/`);
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      success: false,
      message: 'Failed to unsubscribe. Please try again.',
      status: 'unsubscribed',
    };
  }
}

// ============================================
// Category Management
// ============================================

export interface CategoryCounts {
  jobs: number;
  scholarships: number;
  internships: number;
  fellowships: number;
  partners: number;
}

/**
 * Get opportunity counts per category
 * @returns CategoryCounts with counts for each category
 */
export async function getCategoryCounts(): Promise<CategoryCounts> {
  try {
    return await apiFetch<CategoryCounts>('/category-counts/');
  } catch (error) {
    console.error('Failed to load category counts:', error);
    return {
      jobs: 0,
      scholarships: 0,
      internships: 0,
      fellowships: 0,
      partners: 0,
    };
  }
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  opportunity_count: number;
}

/**
 * Get all categories with descriptions and counts
 * @returns Array of CategoryData
 */
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const response = await apiFetch<{ results: CategoryData[] }>('/categories/');
    return response.results || [];
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}