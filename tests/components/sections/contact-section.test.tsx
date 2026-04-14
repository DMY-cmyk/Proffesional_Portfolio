import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactSection } from '@/components/sections/contact-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    p: ({ children, ...p }: any) => <p {...p}>{children}</p>,
    a: ({ children, ...p }: any) => <a {...p}>{children}</a>,
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
    span: ({ children, ...p }: any) => <span {...p}>{children}</span>,
    h2: ({ children, ...p }: any) => <h2 {...p}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ContactSection (redesigned)', () => {
  it('renders the Contact heading', () => {
    render(<ContactSection />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders the professional email as a mailto', () => {
    render(<ContactSection />)
    const emailLink = screen.getByRole('link', { name: /email me/i })
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders the LinkedIn link', () => {
    render(<ContactSection />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('renders a structured contact list with email / linkedin / github / location', () => {
    render(<ContactSection />)
    expect(screen.getByText(/^Email$/i)).toBeInTheDocument()
    expect(screen.getByText(/^LinkedIn$/i)).toBeInTheDocument()
    expect(screen.getByText(/^GitHub$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Location$/i)).toBeInTheDocument()
  })

  it('does NOT render Instagram in the professional contact section', () => {
    render(<ContactSection />)
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument()
  })

  it('does NOT render TikTok in the professional contact section', () => {
    render(<ContactSection />)
    expect(screen.queryByRole('link', { name: /tiktok/i })).not.toBeInTheDocument()
  })
})
