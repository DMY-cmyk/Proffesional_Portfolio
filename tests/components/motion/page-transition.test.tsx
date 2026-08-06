import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageTransition } from '@/components/motion/page-transition'

const mockMotionDiv = vi.fn(({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>)

const state = vi.hoisted(() => ({ reduced: true }))

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => mockMotionDiv(props),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => state.reduced,
}))

describe('PageTransition', () => {
  beforeEach(() => {
    state.reduced = true
    mockMotionDiv.mockClear()
  })

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

  describe('with reduced motion disabled (full variants)', () => {
    beforeEach(() => {
      state.reduced = false
      mockMotionDiv.mockClear()
    })

    it('uses full variants with y-transform on hidden and exit states', () => {
      render(
        <PageTransition>
          <p>Content</p>
        </PageTransition>
      )
      const call = mockMotionDiv.mock.calls[0][0]
      const { variants } = call
      expect(variants).toBeDefined()
      // hidden state: opacity 0, y 14 (rise-in start)
      expect(variants.hidden).toEqual({ opacity: 0, y: 14 })
      // enter state: opacity 1, y 0, with 0.35s duration and specified easing
      expect(variants.enter).toEqual({
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      })
      // exit state: opacity 0, y -8 (drift-out), 0.2s duration
      expect(variants.exit).toEqual({
        opacity: 0,
        y: -8,
        transition: { duration: 0.2, ease: 'easeIn' },
      })
    })

    it('applies correct easing and durations for full variants', () => {
      mockMotionDiv.mockClear()
      render(
        <PageTransition>
          <p>Full Motion Test</p>
        </PageTransition>
      )
      const call = mockMotionDiv.mock.calls[0][0]
      const { variants } = call
      expect(variants.enter.transition.duration).toBe(0.35)
      expect(variants.enter.transition.ease).toEqual([0.22, 1, 0.36, 1])
      expect(variants.exit.transition.duration).toBe(0.2)
      expect(variants.exit.transition.ease).toBe('easeIn')
    })
  })

  it('applies different variants based on reduced motion setting', () => {
    // Test with reduced motion enabled
    state.reduced = true
    mockMotionDiv.mockClear()
    render(
      <PageTransition>
        <p>Reduced</p>
      </PageTransition>
    )
    const reducedCall = mockMotionDiv.mock.calls[0][0]
    const reducedVariants = reducedCall.variants

    // Test with reduced motion disabled
    state.reduced = false
    mockMotionDiv.mockClear()
    render(
      <PageTransition>
        <p>Full</p>
      </PageTransition>
    )
    const fullCall = mockMotionDiv.mock.calls[0][0]
    const fullVariants = fullCall.variants

    // Verify they are different
    expect(reducedVariants.hidden).not.toEqual(fullVariants.hidden)
    expect(reducedVariants.enter.transition.duration).not.toBe(fullVariants.enter.transition.duration)
    expect(reducedVariants.exit.transition.duration).not.toBe(fullVariants.exit.transition.duration)
    // Reduced should be opacity-only
    expect(reducedVariants.hidden).not.toHaveProperty('y')
    // Full should have y values
    expect(fullVariants.hidden).toHaveProperty('y')
    expect(fullVariants.exit).toHaveProperty('y')
  })
})
