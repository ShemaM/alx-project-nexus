/**
 * Django API Service
 * Client for connecting to the Django REST Framework backend.
 */

import { Opportunity, OpportunityFilterParams, APIResponse, SubscriptionResponse } from '@/types'
import { AuthUser } from '@/lib/authz'

/**
 * Sanitize API base URL by removing trailing slashes to prevent double-slash 404 errors.
 * Example: "https://api.example.com/api/" -> "https://api.example.com/api"
 */
function sanitizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

// Ensure no trailing slash on the base URL to maintain predictable concatenation
const DIRECT_API_BASE_URL = sanitizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api');
const CLIENT_PROXY_BASE_URL = '/api/proxy';

/**
 * Classify API errors for better debugging in production.
 * Distinguishes between network/CORS issues and API response errors (like 404).
 */
function classifyError(error: unknown, url: string): string {
  if (error instanceof TypeError) {
    // TypeError typically indicates network failure (CORS blocked, DNS failure, etc.)
    return `[Network Error] Failed to fetch ${url}. This may be a CORS policy issue or the server is unreachable. Check that NEXT_PUBLIC_API_URL is correctly set and the backend allows requests from this origin.`;
  }
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      return `[404 Not Found] The endpoint ${url} was not found. This may indicate a schema mismatch between frontend and backend API routes.`;
    }
    if (error.message.includes('CORS')) {
      return `[CORS Error] Cross-origin request blocked for ${url}. Ensure CORS_ALLOWED_ORIGINS in Django settings includes the frontend domain.`;
    }
    return error.message;
  }
  return String(error);
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  config: { suppressErrorLogging?: boolean; timeoutMs?: number; revalidate?: number | false } = {}
): Promise<T> {
  // Ensure endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Use standard Next.js pattern for server/client detection
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? DIRECT_API_BASE_URL : CLIENT_PROXY_BASE_URL;
  const url = `${baseUrl}${cleanEndpoint}`;
  const timeoutMs = config.timeoutMs ?? 0;
  
  try {
    const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;
    
    // Build fetch options with Next.js caching support
    const requestOptions: RequestInit & { next?: { revalidate?: number | false } } = {
      ...options,
      headers: isFormDataBody
        ? { ...options.headers }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
      credentials: 'include',
    };

    // Add Next.js ISR caching for GET requests on the server
    if (
      isServer && 
      (!options.method || options.method === 'GET') &&
      config.revalidate !== undefined
    ) {
      requestOptions.next = { revalidate: config.revalidate };
    }

    // Timeout is opt-in; avoid forcing short aborts on slower environments.
    if (
      !options.signal &&
      timeoutMs > 0 &&
      typeof AbortSignal !== 'undefined' &&
      typeof AbortSignal.timeout === 'function'
    ) {
      requestOptions.signal = AbortSignal.timeout(timeoutMs);
    }

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      let errorDetails = '';
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const payload = await response.json();
          errorDetails =
            payload?.detail ||
            payload?.error ||
            payload?.message ||
            JSON.stringify(payload);
        } else {
          const text = await response.text();
          errorDetails = text.replace(/\s+/g, ' ').trim().slice(0, 300);
        }
      } catch {
        // Keep default status-only message if response parsing fails.
      }

      // Log with classification for easier debugging
      if (!config.suppressErrorLogging) {
        if (response.status === 404) {
          console.error(`[404 Not Found] Endpoint not found: ${url}`, errorDetails);
        } else {
          console.error(`[API Error ${response.status}] ${url}:`, errorDetails);
        }
      }
      throw new Error(
        `API Error: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`
      );
    }
    
    return response.json();
  } catch (error) {
    if (!config.suppressErrorLogging) {
      const classifiedError = classifyError(error, url);
      console.error(classifiedError);
    }
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
  if (params.categories && params.categories.length > 0) {
    searchParams.set('categories', params.categories.join(','));
  }
  addParamIfPresent(searchParams, 'location', params.location);
  addParamIfPresent(searchParams, 'city', params.city);
}

/**
 * Add work mode and commitment filters
 */
function addWorkFilters(searchParams: URLSearchParams, params: OpportunityFilterParams): void {
  addParamIfPresent(searchParams, 'work_mode', params.work_mode);
  // Support multi-select work modes (comma-separated)
  if (params.work_modes && params.work_modes.length > 0) {
    searchParams.set('work_modes', params.work_modes.join(','));
  }
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
  const normalizedSearch = params.search?.trim().replaceAll(/\s+/g, ' ');
  addParamIfPresent(searchParams, 'search', normalizedSearch);
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
    // Use 60-second cache for homepage data to improve load times
    const response = await apiFetch<any>(`/opportunities/${queryString}`, {}, { suppressErrorLogging: true, revalidate: 60 });
    
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0,
      next: response.next,
      previous: response.previous
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (!message.includes('404')) {
      console.error('Failed to fetch opportunities:', error)
    }
    return { data: [], disclaimer: '', count: 0 };
  }
}

export async function getOpportunityById(id: number): Promise<Opportunity> {
  // Direct detail endpoint always needs the trailing slash
  // Cache individual opportunity pages for 60 seconds
  return apiFetch<Opportunity>(`/opportunities/${id}/`, {}, { revalidate: 60 });
}

/**
 * Get opportunity by slug (SEO-friendly URL)
 * @param slug - The URL-friendly slug of the opportunity
 * @returns Opportunity data
 */
export async function getOpportunityBySlug(slug: string): Promise<Opportunity> {
  // Cache opportunity pages for 60 seconds
  return apiFetch<Opportunity>(`/opportunities/by-slug/${slug}/`, {}, { revalidate: 60 });
}

export async function getFeaturedOpportunities(): Promise<APIResponse<Opportunity[]>> {
  try {
    // Cache featured opportunities for 60 seconds to improve homepage load times
    const response = await apiFetch<any>('/opportunities/?is_featured=true', {}, { suppressErrorLogging: true, revalidate: 60 });
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0
    };
  } catch (error) {
    console.error('Failed to fetch featured opportunities:', error);
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
  return `${CLIENT_PROXY_BASE_URL}/opportunities/${opportunityId}/brochure/`;
}

export async function getAnalyticsOverview(): Promise<any> {
  try {
    return await apiFetch('/analytics/');
  } catch (error) {
    console.error('Failed to fetch analytics overview:', error);
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

export async function getCurrentUser(): Promise<AuthUser | null> {
  // Use standard Next.js pattern for server/client detection
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? DIRECT_API_BASE_URL : CLIENT_PROXY_BASE_URL;
  const candidateEndpoints = ['/auth/me/', '/auth/me'];

  try {
    for (const endpoint of candidateEndpoints) {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        return await response.json();
      }

      // Not logged in or endpoint variant mismatch: treat as anonymous user.
      if (response.status === 401 || response.status === 403) {
        return null;
      }

      // Try next endpoint variant if this one is missing.
      if (response.status === 404) {
        continue;
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

// ============================================
// Partner Management
// ============================================

export async function getPartners(): Promise<APIResponse<any[]>> {
  try {
    // Cache partners for 60 seconds to improve homepage load times
    const response = await apiFetch<any>('/partners/', {}, { revalidate: 60 });
    return {
      data: response.results || [],
      disclaimer: response.disclaimer || '',
      count: response.count || 0
    };
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    return { data: [], disclaimer: '', count: 0 };
  }
}

export interface PartnerPayload {
  name: string
  website_url?: string
  is_featured?: boolean
  logo?: File | null
}

function buildPartnerFormData(payload: PartnerPayload): FormData {
  const formData = new FormData()
  formData.append('name', payload.name)
  if (payload.website_url) {
    formData.append('website_url', payload.website_url)
  }
  if (typeof payload.is_featured === 'boolean') {
    formData.append('is_featured', String(payload.is_featured))
  }
  if (payload.logo) {
    formData.append('logo', payload.logo)
  }
  return formData
}

export async function createPartner(payload: PartnerPayload): Promise<any> {
  const formData = buildPartnerFormData(payload)
  return apiFetch('/partners/', {
    method: 'POST',
    body: formData,
  })
}

export async function updatePartner(id: number, payload: PartnerPayload): Promise<any> {
  const formData = buildPartnerFormData(payload)
  return apiFetch(`/partners/${id}/`, {
    method: 'PATCH',
    body: formData,
  })
}

export async function deletePartner(id: number): Promise<void> {
  await apiFetch(`/partners/${id}/`, {
    method: 'DELETE',
  })
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
  training: number;
  partners: number;
}

/**
 * Get opportunity counts per category
 * @returns CategoryCounts with counts for each category
 */
export async function getCategoryCounts(): Promise<CategoryCounts> {
  try {
    // Cache category counts for 60 seconds to improve homepage load times
    return await apiFetch<CategoryCounts>('/category-counts/', {}, { suppressErrorLogging: true, revalidate: 60 });
  } catch (error) {
    console.error('Failed to fetch category counts:', error);
    return {
      jobs: 0,
      scholarships: 0,
      internships: 0,
      fellowships: 0,
      training: 0,
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
    // Cache categories for 60 seconds
    const response = await apiFetch<{ results: CategoryData[] }>('/categories/', {}, { suppressErrorLogging: true, revalidate: 60 });
    return response.results || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

