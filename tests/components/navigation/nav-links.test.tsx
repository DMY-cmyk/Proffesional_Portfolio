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

const editorialItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Notes', href: '/notes', isSecondary: true },
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
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.className).toContain('text-accent')
  })

  it('does not highlight non-active links', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const skillsLink = screen.getByText('Skills').closest('a')
    expect(skillsLink?.className).not.toContain('text-accent')
  })

  it('renders an underline indicator for the active link', () => {
    const { container } = render(<NavLinks items={mockItems} activeSection="about" />)
    const indicator = container.querySelector('[data-testid="active-indicator"]')
    expect(indicator).toBeInTheDocument()
    expect(indicator?.className).toContain('inset-x-0')
  })

  it('no longer uses the legacy link-underline class', () => {
    render(<NavLinks items={mockItems} />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.className).not.toContain('link-underline')
  })

  it('renders a hover underline element on every link', () => {
    const { container } = render(<NavLinks items={mockItems} />)
    const hovers = container.querySelectorAll('[data-testid="hover-underline"]')
    expect(hovers).toHaveLength(mockItems.length)
  })

  it('uses mono small-caps typography', () => {
    const { container } = render(<NavLinks items={mockItems} />)
    const nav = container.querySelector('nav')
    expect(nav?.className).toContain('font-mono')
    expect(nav?.className).toContain('uppercase')
  })

  it('pushes secondary items to the end with a gold glyph', () => {
    render(<NavLinks items={editorialItems} />)
    const notesLink = screen.getByText('Notes').closest('a')
    expect(notesLink?.className).toContain('ml-auto')
    const glyph = notesLink?.querySelector('[aria-hidden="true"]')
    expect(glyph?.textContent).toBe('↗')
  })

  it('rewrites section anchors through the homepage when off-home', () => {
    render(<NavLinks items={mockItems} pathname="/notes" />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.getAttribute('href')).toBe('/#about')
  })

  it('keeps pure hash anchors on the homepage', () => {
    render(<NavLinks items={mockItems} pathname="/" />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.getAttribute('href')).toBe('#about')
  })

  it('highlights an active page link by pathname', () => {
    render(<NavLinks items={mockItems} pathname="/research" />)
    const researchLink = screen.getByText('Research').closest('a')
    expect(researchLink?.className).toContain('text-accent')
    expect(researchLink?.getAttribute('aria-current')).toBe('page')
  })

  it('marks the scroll-spied section link with aria-current location', () => {
    render(<NavLinks items={mockItems} activeSection="about" pathname="/" />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.getAttribute('aria-current')).toBe('location')
  })

  it('does not apply scroll-spy highlight when off the homepage', () => {
    render(<NavLinks items={mockItems} activeSection="about" pathname="/research" />)
    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink?.className).not.toContain('text-accent')
  })
})