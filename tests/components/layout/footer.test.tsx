import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
  },
}))

describe('Footer (redesigned)', () => {
  it('renders copyright year', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument()
  })
  it('renders the personal link to /personal', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /personal/i })
    expect(link.getAttribute('href')).toMatch(/\/personal$/)
  })
  it('does NOT render Instagram in the footer', () => {
    render(<Footer />)
    expect(screen.queryByRole('link', { name: /instagram/i })).not.toBeInTheDocument()
  })
  it('does NOT render TikTok in the footer', () => {
    render(<Footer />)
    expect(screen.queryByRole('link', { name: /tiktok/i })).not.toBeInTheDocument()
  })
})
