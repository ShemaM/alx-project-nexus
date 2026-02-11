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
 * Add a parameter to search params if it has a value
 */
function addParamIfPresent(
  searchParams: URLSearchParams,
  key: string,
  value: string | number | boolean | undefined,
  stringify = false
): void {
  if (value !== undefined && value !== '') {
    searchParams.set(key, stringify ? String(value) : (value as string));
  }
}

/**
 * Add basic filter parameters
 */
function addBasicFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'docs', params.docs);
  addParamIfPresent(searchParams, 'category', params.category);
<<<<<<< HEAD
=======
  // Support multi-select categories (comma-separated)
  if (params.categories && params.categories.length > 0) {
    searchParams.set('categories', params.categories.join(','));
  }
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
  addParamIfPresent(searchParams, 'location', params.location);
  addParamIfPresent(searchParams, 'city', params.city);
}

/**
 * Add work mode and commitment filters
 */
function addWorkFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'work_mode', params.work_mode);
<<<<<<< HEAD
=======
  // Support multi-select work modes (comma-separated)
  if (params.work_modes && params.work_modes.length > 0) {
    searchParams.set('work_modes', params.work_modes.join(','));
  }
>>>>>>> e9e2226a8e8cc65ff9b2fd85636946ef2c9a6d62
  addParamIfPresent(searchParams, 'commitment', params.commitment);
}

/**
 * Add eligibility filters
 */
function addEligibilityFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'target_group', params.target_group);
  addParamIfPresent(searchParams, 'education_level', params.education_level);
}

/**
 * Add funding filters
 */
function addFundingFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'funding_type', params.funding_type);
  addParamIfPresent(searchParams, 'is_paid', params.is_paid, true);
  addParamIfPresent(searchParams, 'stipend_min', params.stipend_min, true);
  addParamIfPresent(searchParams, 'stipend_max', params.stipend_max, true);
}

/**
 * Add deadline filters
 */
function addDeadlineFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'deadline_before', params.deadline_before);
  addParamIfPresent(searchParams, 'deadline_after', params.deadline_after);
  addParamIfPresent(searchParams, 'closing_soon', params.closing_soon, true);
  addParamIfPresent(searchParams, 'is_rolling', params.is_rolling, true);
}

/**
 * Add status filters
 */
function addStatusFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'is_verified', params.is_verified, true);
  addParamIfPresent(searchParams, 'is_active', params.is_active, true);
  addParamIfPresent(searchParams, 'is_featured', params.is_featured, true);
}

/**
 * Build query string from filter parameters
 * Supports all filter parity parameters between backend and frontend
 */
function buildQueryString(params: OpportunityFilterParams): string {
  const searchParams = new URLSearchParams();
  
  addBasicFilters(searchParams, params);
  addWorkFilters(searchParams, params);
  addEligibilityFilters(searchParams, params);
  addFundingFilters(searchParams, params);
  addDeadlineFilters(searchParams, params);
  addStatusFilters(searchParams, params);
  addParamIfPresent(searchParams, 'search', params.search);
  addParamIfPresent(searchParams, 'ordering', params.ordering);
  
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