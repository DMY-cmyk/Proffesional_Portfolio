import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HoverGlow } from '@/components/motion/hover-glow'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('HoverGlow', () => {
  it('renders children', () => {
    render(
      <HoverGlow>
        <p>Glowing card</p>
      </HoverGlow>
    )
    expect(screen.getByText('Glowing card')).toBeInTheDocument()
  })
})
