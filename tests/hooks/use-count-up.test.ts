import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// IntersectionObserver stub that fires "visible" immediately on observe
class IOStub {
  cb: IntersectionObserverCallback
  constructor(cb: IntersectionObserverCallback) { this.cb = cb }
  observe = () => this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  unobserve = vi.fn()
  disconnect = vi.fn()
}

describe('useCountUp', () => {
  beforeEach(() => {
    // Note: vi.stubGlobal requires a configurable property, but tests/setup.ts
    // defines IntersectionObserver via Object.defineProperty without
    // `configurable: true`, so it cannot be redefined that way. Direct
    // assignment (writable: true is set in setup.ts) works instead, matching
    // the pattern already used in tests/hooks/use-viewport-visible.test.ts.
    ;(global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IOStub

    // jsdom does not implement matchMedia; the real useReducedMotion hook
    // (exercised in the first test below) needs it to avoid throwing.
    // Same stub pattern as tests/hooks/use-reduced-motion.test.ts.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
  })

  it('starts at 0 before the element is attached', async () => {
    const { useCountUp } = await import('@/hooks/use-count-up')
    const { result } = renderHook(() => useCountUp(42))
    expect(result.current.value).toBe(0)
  })

  it('jumps straight to target under reduced motion once visible', async () => {
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
    vi.resetModules()
    const { useCountUp } = await import('@/hooks/use-count-up')
    const { result } = renderHook(() => useCountUp(42))
    const el = document.createElement('span')
    act(() => { result.current.ref.current = el; result.current.attach(el) })
    expect(result.current.value).toBe(42)
    vi.doUnmock('@/hooks/use-reduced-motion')
    vi.resetModules()
  })
})
