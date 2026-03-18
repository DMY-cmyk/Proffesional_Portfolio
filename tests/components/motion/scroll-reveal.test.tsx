import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ScrollReveal', () => {
  it('renders children', () => {
    render(
      <ScrollReveal>
        <p>Reveal me</p>
      </ScrollReveal>
    )
    expect(screen.getByText('Reveal me')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <ScrollReveal className="custom-class">
        <p>Content</p>
      </ScrollReveal>
    )
    expect(container.firstElementChild?.className).toContain('custom-class')
  })
})
