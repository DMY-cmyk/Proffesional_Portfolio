import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

describe('CustomCursor', () => {
  it('renders a canvas on non-touch non-reduced devices', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => false }))
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => false }))
    const { CustomCursor } = await import('@/components/motion/custom-cursor')
    const { container } = render(<CustomCursor />)
    const canvas = container.querySelector('[data-testid="custom-cursor"]')
    expect(canvas).toBeTruthy()
    expect(canvas?.tagName).toBe('CANVAS')
  })
  it('renders nothing on touch devices', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => false }))
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => true }))
    const { CustomCursor } = await import('@/components/motion/custom-cursor')
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('[data-testid="custom-cursor"]')).toBeNull()
  })
  it('renders nothing when reduced-motion is set', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
    vi.doMock('@/hooks/use-is-touch', () => ({ useIsTouch: () => false }))
    const { CustomCursor } = await import('@/components/motion/custom-cursor')
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('[data-testid="custom-cursor"]')).toBeNull()
  })
})
