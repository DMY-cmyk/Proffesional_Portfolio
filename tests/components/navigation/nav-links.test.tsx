import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { NavLinks } from '@/components/navigation/nav-links'

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
})