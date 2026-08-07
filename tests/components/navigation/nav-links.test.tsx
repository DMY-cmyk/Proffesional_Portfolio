import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { NavLinks } from '@/components/navigation/nav-links'

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, layoutId, initial, animate, exit, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

const mockItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Research', href: '/research' },
]

describe('NavLinks', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders all navigation items', () => {
    render(<NavLinks items={mockItems} />)
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('highlights the active section link', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.className).toContain('text-accent')
  })

  it('does not highlight non-active links', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const skillsLink = screen.getByText('Skills')
    expect(skillsLink.className).not.toContain('text-accent')
  })

  it('renders an underline indicator for the active link', () => {
    const { container } = render(<NavLinks items={mockItems} activeSection="about" />)
    const indicator = container.querySelector('[data-testid="active-indicator"]')
    expect(indicator).toBeInTheDocument()
  })

  it('applies the underline draw-on class to links', () => {
    render(<NavLinks items={mockItems} />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.className).toContain('link-underline')
  })

  it('rewrites section anchors through the homepage when off-home', () => {
    render(<NavLinks items={mockItems} pathname="/notes" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.getAttribute('href')).toBe('/#about')
  })

  it('keeps pure hash anchors on the homepage', () => {
    render(<NavLinks items={mockItems} pathname="/" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.getAttribute('href')).toBe('#about')
  })

  it('highlights an active page link by pathname', () => {
    render(<NavLinks items={mockItems} pathname="/research" />)
    const researchLink = screen.getByText('Research')
    expect(researchLink.className).toContain('text-accent')
    expect(researchLink.getAttribute('aria-current')).toBe('page')
  })

  it('marks the scroll-spied section link with aria-current location', () => {
    render(<NavLinks items={mockItems} activeSection="about" pathname="/" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.getAttribute('aria-current')).toBe('location')
  })

  it('does not apply scroll-spy highlight when off the homepage', () => {
    render(<NavLinks items={mockItems} activeSection="about" pathname="/research" />)
    const aboutLink = screen.getByText('About')
    expect(aboutLink.className).not.toContain('text-accent')
  })
})