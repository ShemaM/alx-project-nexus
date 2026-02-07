/**
 * Unit tests for Opportunity types and slug generation
 */
import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/types'

describe('generateSlug', () => {
  it('should convert title to lowercase slug', () => {
    const slug = generateSlug('Software Developer Position')
    expect(slug).toBe('software-developer-position')
  })

  it('should remove special characters', () => {
    const slug = generateSlug('Senior Developer (Remote) - 2024!')
    expect(slug).toBe('senior-developer-remote-2024')
  })

  it('should handle multiple spaces', () => {
    const slug = generateSlug('Web   Developer    Job')
    expect(slug).toBe('web-developer-job')
  })

  it('should trim leading and trailing hyphens', () => {
    const slug = generateSlug('-Test Position-')
    expect(slug).toBe('test-position')
  })

  it('should handle empty string', () => {
    const slug = generateSlug('')
    expect(slug).toBe('')
  })

  it('should handle unicode characters', () => {
    const slug = generateSlug('Développeur Web')
    expect(slug).toBe('dveloppeur-web')
  })
})
