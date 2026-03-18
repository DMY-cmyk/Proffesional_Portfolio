import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineSection } from '@/components/sections/timeline-section'

describe('TimelineSection', () => {
  it('renders the Experience & Education heading', () => {
    render(<TimelineSection />)
    expect(
      screen.getByRole('heading', { name: /experience.*education/i })
    ).toBeInTheDocument()
  })

  it('renders education entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/universitas|university/i)).toBeInTheDocument()
  })

  it('renders experience entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/Tax & Audit Intern/i)).toBeInTheDocument()
  })

  it('has the experience section id', () => {
    render(<TimelineSection />)
    expect(document.getElementById('experience')).toBeInTheDocument()
  })

  it('renders date ranges for each entry', () => {
    render(<TimelineSection />)
    const datePattern = /\w{3} \d{4}|Present/
    const dateElements = screen.getAllByText(datePattern)
    expect(dateElements.length).toBeGreaterThan(0)
  })
})