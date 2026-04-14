import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResearchCard } from '@/components/ui/research-card'

const entry = {
  title: 'Tax Literacy & Compliance Outcomes',
  slug: 'tax-literacy',
  abstract: 'Analysis of 90+ taxpayers.',
  tags: ['tax'],
  date: '2025-12',
  type: 'working-paper' as const,
}

describe('ResearchCard', () => {
  it('renders title as h4', () => {
    render(<ResearchCard entry={entry} />)
    expect(screen.getByRole('heading', { level: 4 }).textContent).toContain('Tax Literacy')
  })
  it('renders short meta with type + year', () => {
    render(<ResearchCard entry={entry} />)
    expect(screen.getByText(/Working Paper/i)).toBeInTheDocument()
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })
  it('renders as a link to the detail page', () => {
    render(<ResearchCard entry={entry} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('/research/tax-literacy'))
  })
})
