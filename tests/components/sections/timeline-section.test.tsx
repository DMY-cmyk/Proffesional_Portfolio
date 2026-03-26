import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineSection } from '@/components/sections/timeline-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('TimelineSection', () => {
  it('renders the Experience & Education heading', () => {
    render(<TimelineSection />)
    expect(
      screen.getByRole('heading', { name: /experience.*education/i })
    ).toBeInTheDocument()
  })

  it('renders education entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/STIE YKPN|Business School/i)).toBeInTheDocument()
  })

  it('renders experience entries', () => {
    render(<TimelineSection />)
    expect(screen.getByText(/Operations Officer/i)).toBeInTheDocument()
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