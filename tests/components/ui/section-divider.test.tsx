import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionDivider } from '@/components/ui/section-divider'

describe('SectionDivider', () => {
  it('renders a div with aria-hidden="true"', () => {
    const { container } = render(<SectionDivider />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })

  it('contains gradient line element with h-px class', () => {
    const { container } = render(<SectionDivider />)
    const line = container.querySelector('.h-px')
    expect(line).toBeInTheDocument()
  })
})
