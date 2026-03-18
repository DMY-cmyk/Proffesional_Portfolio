import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CustomCursor } from '@/components/motion/custom-cursor'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
  useSpring: () => ({ set: vi.fn(), get: () => 0 }),
}))

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

describe('CustomCursor', () => {
  it('renders cursor elements', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('pointer: fine'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const { container } = render(<CustomCursor />)
    const cursorElements = container.querySelectorAll('[aria-hidden="true"]')
    expect(cursorElements.length).toBeGreaterThan(0)
  })

  it('returns null on touch devices', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const { container } = render(<CustomCursor />)
    expect(container.innerHTML).toBe('')
  })
})
