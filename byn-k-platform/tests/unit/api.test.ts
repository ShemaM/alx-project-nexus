/**
 * Unit tests for API functions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API buildQueryString', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should handle empty filter params', async () => {
    // Import dynamically to allow mocking
    const { getOpportunities } = await import('@/lib/api')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [], count: 0 })
    })

    const result = await getOpportunities({})
    expect(result.data).toEqual([])
    expect(result.count).toBe(0)
  })

  it('should handle API errors gracefully', async () => {
    const { getOpportunities } = await import('@/lib/api')
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await getOpportunities()
    expect(result.data).toEqual([])
    expect(result.count).toBe(0)
  })
})

describe('CategoryCounts API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should return default counts on error', async () => {
    const { getCategoryCounts } = await import('@/lib/api')
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await getCategoryCounts()
    expect(result).toEqual({
      jobs: 0,
      scholarships: 0,
      internships: 0,
      fellowships: 0,
      partners: 0
    })
  })

  it('should return counts from API', async () => {
    const { getCategoryCounts } = await import('@/lib/api')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        jobs: 10,
        scholarships: 5,
        internships: 3,
        fellowships: 2,
        partners: 8
      })
    })

    const result = await getCategoryCounts()
    expect(result.jobs).toBe(10)
    expect(result.scholarships).toBe(5)
  })
})

describe('Subscribe API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should return success response on valid email', async () => {
    const { subscribe } = await import('@/lib/api')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Please check your email',
        status: 'pending_confirmation'
      })
    })

    const result = await subscribe('test@example.com')
    expect(result.success).toBe(true)
    expect(result.status).toBe('pending_confirmation')
  })

  it('should handle already subscribed case', async () => {
    const { subscribe } = await import('@/lib/api')
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Already subscribed',
        status: 'already_subscribed'
      })
    })

    const result = await subscribe('existing@example.com')
    expect(result.status).toBe('already_subscribed')
  })
})
