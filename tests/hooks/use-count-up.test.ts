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

  it('honors a reduced-motion preference that resolves true after the observer was created, not the value at attach time', async () => {
    // Uses the REAL useReducedMotion (no vi.doMock), so this exercises the
    // actual async matchMedia -> state -> effect -> ref plumbing, not a
    // hardcoded stub. This directly targets the race described in review:
    // useReducedMotion() returns false synchronously on first render and
    // only resolves the OS preference via an effect; the observer must not
    // close over that stale `false`.
    vi.resetModules()

    // Controllable matchMedia stub: starts false, and exposes the
    // registered change handler so the test can flip it later.
    let changeHandler: ((e: MediaQueryListEvent) => void) | undefined
    const mql = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        changeHandler = cb
      },
      removeEventListener: vi.fn(),
    }
    window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia

    // IntersectionObserver stub that captures its callback instead of
    // firing immediately, so the test controls exactly when "visible"
    // fires relative to the matchMedia change.
    let ioCallback: IntersectionObserverCallback | undefined
    class DeferredIOStub {
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb
      }
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    }
    ;(global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = DeferredIOStub

    const { useCountUp } = await import('@/hooks/use-count-up')
    const { result } = renderHook(() => useCountUp(42))

    // Attach while the OS preference is still "no preference" (false) —
    // this is the moment the buggy code would close over reduced=false.
    const el = document.createElement('span')
    act(() => {
      result.current.ref.current = el
      result.current.attach(el)
    })

    // The preference flips to reduced motion AFTER the observer exists.
    mql.matches = true
    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent)
    })

    // Only now does the (already-created) observer report visibility.
    act(() => {
      ioCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    })

    // Must jump straight to target with no animated intermediate value.
    expect(result.current.value).toBe(42)
  })
})
