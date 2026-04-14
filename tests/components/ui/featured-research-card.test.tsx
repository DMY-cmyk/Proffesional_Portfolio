import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedResearchCard } from '@/components/ui/featured-research-card'

const entry = {
  title: 'The Effect of Sustainability Report Disclosure on Firm Value in the Manufacturing Sector',
  slug: 'sustainability-reporting-firm-value',
  abstract: 'Examines whether disclosure quality affects firm value among Indonesian manufacturers.',
  tags: ['sustainability reporting', 'firm value'],
  date: '2026-04',
  type: 'thesis' as const,
  featured: true,
}

describe('FeaturedResearchCard', () => {
  it('renders the featured thesis badge', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText(/featured/i)).toBeInTheDocument()
    expect(screen.getByText(/thesis/i)).toBeInTheDocument()
  })

  it('renders the title as an h3', () => {
    render(<FeaturedResearchCard entry={entry} />)
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3.textContent).toContain('Sustainability Report Disclosure')
  })

  it('renders the abstract', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText(/disclosure quality/i)).toBeInTheDocument()
  })

  it('renders each tag', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.getByText('sustainability reporting')).toBeInTheDocument()
    expect(screen.getByText('firm value')).toBeInTheDocument()
  })

  it('renders the Read abstract link pointing to the detail page', () => {
    render(<FeaturedResearchCard entry={entry} />)
    const link = screen.getByRole('link', { name: /read abstract/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('/research/sustainability-reporting-firm-value'))
  })

  it('does not render a PDF download button when pdfPath is missing', () => {
    render(<FeaturedResearchCard entry={entry} />)
    expect(screen.queryByRole('link', { name: /download pdf/i })).not.toBeInTheDocument()
  })
})
