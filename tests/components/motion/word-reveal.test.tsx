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

  it('exposes the full text to assistive tech as visually hidden content', () => {
    render(<WordReveal text="firm value" />)
    const srText = screen.getByText('firm value')
    expect(srText).toBeInTheDocument()
    expect(srText.className).toContain('sr-only')
    expect(srText.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('never puts aria-label on a role-less element (aria-prohibited-attr)', () => {
    const { container } = render(<WordReveal text="firm value" />)
    const labelled = container.querySelectorAll('[aria-label]')
    for (const el of labelled) {
      // aria-label is only valid on elements with a role that supports it;
      // WordReveal renders plain spans, so it must not use aria-label at all.
      expect(el.getAttribute('role')).not.toBeNull()
    }
    expect(container.querySelector('span[aria-label]:not([role])')).toBeNull()
  })

  it('hides the animated per-word spans from assistive tech', () => {
    render(<WordReveal text="firm value" />)
    const word = screen.getByText('firm')
    expect(word.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
