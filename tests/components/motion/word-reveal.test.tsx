import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, initial, animate, transition, variants, ...props }: any) => (
      <span {...props}>{children}</span>
    ),
  },
}))

import { WordReveal } from '@/components/motion/word-reveal'

describe('WordReveal', () => {
  afterEach(() => cleanup())

  it('renders every word of the text', () => {
    render(<WordReveal text="Sustainability creates firm value" />)
    for (const word of ['Sustainability', 'creates', 'firm', 'value']) {
      expect(screen.getByText(word)).toBeInTheDocument()
    }
  })

  it('keeps the full text readable by assistive tech', () => {
    render(<WordReveal text="firm value" />)
    expect(screen.getByLabelText('firm value')).toBeInTheDocument()
  })
})
