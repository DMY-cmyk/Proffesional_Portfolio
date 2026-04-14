import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('HeroSection (redesigned)', () => {
  it('renders owner name as the eyebrow', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Dzaki Muhammad Yusfian/i)).toBeInTheDocument()
  })

  it('renders the headline as an h1', () => {
    render(<HeroSection />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1.textContent).toMatch(/sustainability research/i)
  })

  it('renders the status ribbon with three labels', () => {
    render(<HeroSection />)
    expect(screen.getByText(/^Now$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Based in$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Education$/i)).toBeInTheDocument()
  })

  it('renders the Read my research CTA anchoring to #research', () => {
    render(<HeroSection />)
    const link = screen.getByRole('link', { name: /read my research/i })
    expect(link).toHaveAttribute('href', '#research')
  })

  it('renders Download CV as the secondary CTA', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: /download cv/i })).toBeInTheDocument()
  })

  it('renders the avatar image', () => {
    render(<HeroSection />)
    const img = screen.getByAltText(/dzaki/i)
    expect(img.tagName).toBe('IMG')
  })

  it('has the hero section id', () => {
    render(<HeroSection />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })

  it('does NOT render the old shimmer gradient text', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.hero-gradient-text')).toBeNull()
  })

  it('does NOT render the old avatar glow', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('.animate-avatar-glow')).toBeNull()
  })
})
