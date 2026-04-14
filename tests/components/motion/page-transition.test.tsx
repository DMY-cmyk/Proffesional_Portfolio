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

  it('uses opacity-only variants without scale or blur', () => {
    mockMotionDiv.mockClear()
    render(
      <PageTransition>
        <p>Content</p>
      </PageTransition>
    )
    const call = mockMotionDiv.mock.calls[0][0]
    const { variants } = call
    expect(variants).toBeDefined()
    // hidden state: only opacity
    expect(variants.hidden).toEqual({ opacity: 0 })
    // enter state: only opacity + transition (no scale, no y, no filter)
    expect(variants.enter.opacity).toBe(1)
    expect(variants.enter).not.toHaveProperty('scale')
    expect(variants.enter).not.toHaveProperty('y')
    expect(variants.enter).not.toHaveProperty('filter')
    // exit state: only opacity + transition (no scale, no y, no filter)
    expect(variants.exit.opacity).toBe(0)
    expect(variants.exit).not.toHaveProperty('scale')
    expect(variants.exit).not.toHaveProperty('y')
    expect(variants.exit).not.toHaveProperty('filter')
  })

  it('renders children without blur filter', () => {
    const { container } = render(
      <PageTransition>
        <div>content</div>
      </PageTransition>
    )
    const rendered = container.innerHTML
    expect(rendered).toContain('content')
    // Ensure no filter:blur() style is applied
    const withBlur = container.querySelector('[style*="blur"]')
    expect(withBlur).toBeNull()
  })
})
