import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, initial, animate, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
  useTransform: () => 0,
}))

import { TimelineWithSpine } from '@/components/motion/timeline-with-spine'

describe('TimelineWithSpine', () => {
  afterEach(() => cleanup())

  it('renders its children', () => {
    render(
      <TimelineWithSpine>
        <div>row-1</div>
        <div>row-2</div>
      </TimelineWithSpine>
    )
    expect(screen.getByText('row-1')).toBeInTheDocument()
    expect(screen.getByText('row-2')).toBeInTheDocument()
  })

  it('renders the spine element', () => {
    render(<TimelineWithSpine><div /></TimelineWithSpine>)
    expect(screen.getByTestId('timeline-spine')).toBeInTheDocument()
  })
})
