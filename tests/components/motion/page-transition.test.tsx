import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageTransition } from '@/components/motion/page-transition'

const mockMotionDiv = vi.fn(({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>)

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => mockMotionDiv(props),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <p>Page content</p>
      </PageTransition>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('does not apply blur filter to animation', () => {
    mockMotionDiv.mockClear()
    render(
      <PageTransition>
        <p>Content</p>
      </PageTransition>
    )
    const call = mockMotionDiv.mock.calls[0][0]
    expect(call.initial).not.toHaveProperty('filter')
    expect(call.animate).not.toHaveProperty('filter')
    expect(call.exit).not.toHaveProperty('filter')
  })
})
