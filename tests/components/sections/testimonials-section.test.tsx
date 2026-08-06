import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const mockData = vi.hoisted(() => ({ entries: [] as unknown[] }))
vi.mock('@/data/content', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/content')>()
  return { ...original, getTestimonials: () => mockData.entries }
})

vi.mock('@/hooks/use-language', () => ({
  useLanguage: vi.fn(() => ({ lang: 'en', setLang: () => {} })),
}))

import { TestimonialsSection } from '@/components/sections/testimonials-section'

describe('TestimonialsSection', () => {
  afterEach(() => { cleanup(); mockData.entries = [] })

  it('renders nothing when there are no testimonials', () => {
    const { container } = render(<TestimonialsSection />)
    expect(container.innerHTML).toBe('')
  })

  it('renders quotes when data exists', () => {
    mockData.entries = [
      { quote: 'A rigorous, reliable analyst.', name: 'Jane Doe', role: 'Thesis Supervisor', relationship: 'Academic advisor' },
    ]
    render(<TestimonialsSection />)
    expect(screen.getByText(/rigorous, reliable analyst/i)).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })
})
