import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from '@/components/ui/section-heading'

describe('SectionHeading', () => {
  it('renders title as h2 with font-display class', () => {
    render(<SectionHeading title="About Me" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('About Me')
    expect(heading.className).toContain('font-display')
  })

  it('renders sectionNumber and label when both provided', () => {
    render(<SectionHeading title="About Me" sectionNumber="01" label="Who I am" />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('Who I am')).toBeInTheDocument()
  })

  it('omits number/label row when props not provided', () => {
    const { container } = render(<SectionHeading title="About Me" />)
    expect(container.querySelector('.font-mono')).not.toBeInTheDocument()
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
})