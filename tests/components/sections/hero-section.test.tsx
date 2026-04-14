import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/sections/hero-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('HeroSection', () => {
  it('renders the profile title as h1', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBeTruthy()
  })

  it('renders the profile title', () => {
    render(<HeroSection />)
    expect(screen.getByText(/accounting.*sustainability research/i)).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<HeroSection />)
    expect(screen.getByText(/specializing|tax|audit/i)).toBeInTheDocument()
  })

  it('has the hero section id', () => {
    render(<HeroSection />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })

  it('renders the avatar image', () => {
    render(<HeroSection />)
    const avatar = screen.getByAltText(/dzaki/i)
    expect(avatar).toBeInTheDocument()
    expect(avatar.tagName).toBe('IMG')
  })

  it('renders CTA buttons', () => {
    render(<HeroSection />)
    const seeWork = screen.getByText('See my work')
    const aboutMe = screen.getByText('About me')
    expect(seeWork).toBeInTheDocument()
    expect(seeWork.closest('a')).toHaveAttribute('href', '#certifications')
    expect(aboutMe).toBeInTheDocument()
    expect(aboutMe.closest('a')).toHaveAttribute('href', '#about')
  })

  it('renders scroll hint', () => {
    render(<HeroSection />)
    const scrollHint = document.querySelector('.animate-scroll-hint')
    expect(scrollHint).toBeInTheDocument()
  })
})