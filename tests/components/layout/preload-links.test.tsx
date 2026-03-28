import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { PreloadLinks } from '@/components/layout/preload-links'

vi.mock('@/lib/base-path', () => ({
  withBasePath: (p: string) => p,
}))

function findLinks() {
  const headLinks = Array.from(document.head.querySelectorAll('link'))
  const bodyLinks = Array.from(document.body.querySelectorAll('link'))
  return [...headLinks, ...bodyLinks]
}

describe('PreloadLinks', () => {
  afterEach(() => {
    cleanup()
    document.head.querySelectorAll('link').forEach(l => l.remove())
  })

  it('renders preconnect link for Google Fonts', () => {
    render(<PreloadLinks />)
    const links = findLinks()
    const preconnect = links.find(
      l => l.rel === 'preconnect' && l.href.includes('fonts.googleapis.com')
    )
    expect(preconnect).toBeTruthy()
  })

  it('renders preconnect link for Google Fonts static', () => {
    render(<PreloadLinks />)
    const links = findLinks()
    const preconnect = links.find(
      l => l.rel === 'preconnect' && l.href.includes('fonts.gstatic.com')
    )
    expect(preconnect).toBeTruthy()
    expect(preconnect?.getAttribute('crossorigin')).toBe('anonymous')
  })

  it('renders preload link for avatar image', () => {
    render(<PreloadLinks />)
    const links = findLinks()
    const preload = links.find(
      l => l.rel === 'preload' && l.getAttribute('as') === 'image'
    )
    expect(preload).toBeTruthy()
    expect(preload?.getAttribute('href')).toBe('/images/profile/avatar.jpg')
  })
})
