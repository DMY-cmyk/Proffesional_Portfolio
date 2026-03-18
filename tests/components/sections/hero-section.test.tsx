import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('HeroSection', () => {
  it('renders the profile name as h1', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBeTruthy()
  })

  it('renders the profile title', () => {
    render(<HeroSection />)
    expect(screen.getByText(/accounting|finance/i)).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/specializing|tax|audit/i)).toBeInTheDocument()
  })

  it('has the hero section id', () => {
    render(<HeroSection />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })
})