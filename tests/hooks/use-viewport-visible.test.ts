import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import { useViewportVisible } from '@/hooks/use-viewport-visible'

describe('useViewportVisible', () => {
  it('returns false by default', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useViewportVisible(ref)
    })
    expect(result.current).toBe(false)
  })
  it('flips to true when observer reports isIntersecting', () => {
    let observerCb: IntersectionObserverCallback = () => {}
    ;(global as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) { observerCb = cb }
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
    }
    const el = document.createElement('div')
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el)
      return useViewportVisible(ref)
    })
    act(() => {
      observerCb([{ isIntersecting: true } as any], {} as any)
    })
    expect(result.current).toBe(true)
  })
})
