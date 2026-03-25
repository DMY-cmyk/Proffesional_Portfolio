import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

describe('Footer', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders social links with accessible labels', () => {
    render(<Footer />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders social links as external links', () => {
    render(<Footer />)
    const linkedinLink = screen.getByLabelText('LinkedIn')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a back-to-top button', () => {
    render(<Footer />)
    expect(screen.getByRole('button', { name: /top|scroll/i })).toBeInTheDocument()
  })

  it('renders the tagline text', () => {
    render(<Footer />)
    expect(screen.getByText('Designed & built with curiosity.')).toBeInTheDocument()
  })

  it('renders a gradient top border', () => {
    const { container } = render(<Footer />)
    const gradientDiv = container.querySelector('.bg-gradient-to-r')
    expect(gradientDiv).toBeInTheDocument()
  })
})