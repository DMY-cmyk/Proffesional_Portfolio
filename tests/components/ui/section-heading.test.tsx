import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from '@/components/ui/section-heading'

describe('SectionHeading', () => {
  it('renders title as h2', () => {
    render(<SectionHeading title="About Me" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('About Me')
  })

  it('renders subtitle when provided', () => {
    render(<SectionHeading title="Skills" subtitle="What I bring to the table" />)
    expect(screen.getByText('What I bring to the table')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<SectionHeading title="Skills" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('renders the gold divider', () => {
    const { container } = render(<SectionHeading title="Test" />)
    const divider = container.querySelector('.bg-gold-500')
    expect(divider).toBeInTheDocument()
  })
})