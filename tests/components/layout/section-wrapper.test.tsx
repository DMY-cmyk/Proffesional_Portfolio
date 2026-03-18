import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionWrapper } from '@/components/layout/section-wrapper'

describe('SectionWrapper', () => {
  it('renders children within a section element with correct id', () => {
    render(
      <SectionWrapper id="about">
        <p>Hello World</p>
      </SectionWrapper>
    )
    const section = document.getElementById('about')
    expect(section).toBeInTheDocument()
    expect(section?.tagName).toBe('SECTION')
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <SectionWrapper id="test" className="bg-surface">
        <p>Content</p>
      </SectionWrapper>
    )
    const section = document.getElementById('test')
    expect(section?.className).toContain('bg-surface')
  })

  it('wraps children in a max-width container', () => {
    render(
      <SectionWrapper id="test">
        <p>Content</p>
      </SectionWrapper>
    )
    const section = document.getElementById('test')
    const container = section?.firstElementChild
    expect(container?.className).toContain('max-w')
  })
})