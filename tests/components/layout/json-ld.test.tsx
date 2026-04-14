import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

// Mock the data modules
vi.mock('@/data/content', () => ({
  getProfile: vi.fn(),
  getSiteConfig: vi.fn(),
  getProfessionalContact: vi.fn(),
  getPersonalContact: vi.fn(),
}))

import { getProfile, getSiteConfig, getProfessionalContact, getPersonalContact } from '@/data/content'
import { JsonLd } from '@/components/layout/json-ld'

const mockGetProfile = vi.mocked(getProfile)
const mockGetSiteConfig = vi.mocked(getSiteConfig)
const mockGetProfessionalContact = vi.mocked(getProfessionalContact)
const mockGetPersonalContact = vi.mocked(getPersonalContact)

function setupMocks(overrides: {
  avatar?: string
  linkedin?: string
  github?: string
  instagram?: string
  tiktok?: string
} = {}) {
  mockGetProfile.mockReturnValue({
    name: 'Test User',
    title: 'Test Title',
    tagline: 'Test tagline',
    bio: 'Test bio',
    brandStatement: 'Test brand',
    avatar: overrides.avatar ?? '/images/profile/avatar.jpg',
  })
  mockGetSiteConfig.mockReturnValue({
    title: 'Test Site',
    description: 'Test description',
    url: 'https://example.com/portfolio',
    ogImage: '/portfolio/images/og-image.jpg',
    locale: 'en',
  })
  mockGetProfessionalContact.mockReturnValue({
    email: 'test@example.com',
    linkedin: overrides.linkedin ?? 'https://linkedin.com/in/test',
    github: overrides.github ?? 'https://github.com/test',
    location: 'Test City',
  })
  mockGetPersonalContact.mockReturnValue({
    instagram: overrides.instagram ?? '',
    tiktok: overrides.tiktok ?? '',
  })
}

function getStructuredData(container: HTMLElement): Record<string, unknown> {
  const script = container.querySelector('script[type="application/ld+json"]')
  if (!script?.textContent) throw new Error('No JSON-LD script found')
  return JSON.parse(script.textContent)
}

describe('JsonLd', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders structured data with all fields when avatar is set', () => {
    setupMocks()
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe('Test User')
    expect(data.jobTitle).toBe('Test Title')
    expect(data.description).toBe('Test bio')
    expect(data.url).toBe('https://example.com/portfolio')
    expect(data.image).toBe('https://example.com/portfolio/images/profile/avatar.jpg')
  })

  it('omits image field when avatar is empty string', () => {
    setupMocks({ avatar: '' })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data).not.toHaveProperty('image')
  })

  it('filters out empty social links from sameAs', () => {
    setupMocks({ linkedin: 'https://linkedin.com/in/test', github: '', instagram: '', tiktok: '' })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data.sameAs).toEqual(['https://linkedin.com/in/test'])
  })

  it('renders sameAs with all non-empty social links', () => {
    setupMocks({
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
      instagram: 'https://instagram.com/test',
      tiktok: 'https://tiktok.com/@test',
    })
    const { container } = render(<JsonLd />)
    const data = getStructuredData(container)

    expect(data.sameAs).toEqual([
      'https://linkedin.com/in/test',
      'https://github.com/test',
      'https://instagram.com/test',
      'https://tiktok.com/@test',
    ])
  })

  it('includes knowsAbout with Sustainability Reporting', () => {
    setupMocks()
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script?.textContent).toContain('Sustainability Reporting')
  })

  it('includes alumniOf STIE YKPN', () => {
    setupMocks()
    const { container } = render(<JsonLd />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script?.textContent).toContain('STIE YKPN')
  })
})
