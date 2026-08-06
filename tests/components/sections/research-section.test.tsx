import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResearchSection } from '@/components/sections/research-section'

vi.mock('@/hooks/use-language', () => ({
  useLanguage: vi.fn(() => ({ lang: 'en', setLang: () => {} })),
}))

describe('ResearchSection', () => {
  it('renders the section heading Research', () => {
    render(<ResearchSection />)
    expect(screen.getByRole('heading', { level: 2, name: /research/i })).toBeInTheDocument()
  })

  it('renders the Featured Thesis card when entries include a thesis', () => {
    render(<ResearchSection />)
    expect(screen.getByText(/featured · thesis/i)).toBeInTheDocument()
    expect(screen.getByText(/sustainability report disclosure/i)).toBeInTheDocument()
  })

  it('renders the #research anchor id', () => {
    render(<ResearchSection />)
    expect(document.getElementById('research')).toBeInTheDocument()
  })

  it('does not render the secondary grid when research has <= 1 entry', () => {
    render(<ResearchSection />)
    expect(screen.queryByTestId('research-secondary-grid')).not.toBeInTheDocument()
  })
})
