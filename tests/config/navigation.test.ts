import { describe, it, expect } from 'vitest'
import {
  navbarItems,
  sectionLinks,
  allNavItems,
  resolveNavHref,
  isPageLinkActive,
} from '@/config/navigation'

describe('navbarItems', () => {
  it('contains the six section links plus Notes, with no /research duplicate', () => {
    expect(navbarItems.map((i) => i.href)).toEqual([
      '#research',
      '#experience',
      '#education',
      '#credentials',
      '#skills',
      '#contact',
      '/notes',
    ])
  })

  it('has no duplicate labels', () => {
    const labels = navbarItems.map((i) => i.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('leaves the command palette item list untouched', () => {
    expect(allNavItems.map((i) => i.href)).toContain('/research')
    expect(sectionLinks).toHaveLength(6)
  })
})

describe('resolveNavHref', () => {
  it('keeps section anchors as pure hashes on the homepage', () => {
    expect(resolveNavHref('#research', '/')).toBe('#research')
  })

  it('routes section anchors through the homepage when off-home', () => {
    expect(resolveNavHref('#research', '/notes')).toBe('/#research')
    expect(resolveNavHref('#contact', '/research/thesis')).toBe('/#contact')
  })

  it('resolves page links through withBasePath', () => {
    expect(resolveNavHref('/notes', '/')).toBe('/notes')
  })
})

describe('isPageLinkActive', () => {
  it('is false for section anchors', () => {
    expect(isPageLinkActive('#research', '/')).toBe(false)
  })

  it('matches exact page path and nested paths', () => {
    expect(isPageLinkActive('/notes', '/notes')).toBe(true)
    expect(isPageLinkActive('/notes', '/notes/some-slug')).toBe(true)
  })

  it('does not match unrelated paths', () => {
    expect(isPageLinkActive('/notes', '/')).toBe(false)
    expect(isPageLinkActive('/notes', '/notesarchive')).toBe(false)
  })
})

describe('navbarItems secondary flag', () => {
  it('marks the Notes item as secondary', () => {
    const notes = navbarItems.find((item) => item.href === '/notes')
    expect(notes?.isSecondary).toBe(true)
  })

  it('does not mark section links as secondary', () => {
    for (const item of navbarItems.filter((i) => i.href.startsWith('#'))) {
      expect(item.isSecondary).toBeUndefined()
    }
  })
})
