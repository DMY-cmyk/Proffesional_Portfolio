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
    expect(aboutLink.className).toContain('gold')
  })

  it('does not highlight non-active links', () => {
    render(<NavLinks items={mockItems} activeSection="about" />)
    const skillsLink = screen.getByText('Skills')
    expect(skillsLink.className).not.toContain('gold')
  })

  it('renders an underline indicator for the active link', () => {
    const { container } = render(<NavLinks items={mockItems} activeSection="about" />)
    const indicator = container.querySelector('[data-testid="active-indicator"]')
    expect(indicator).toBeInTheDocument()
  })
})