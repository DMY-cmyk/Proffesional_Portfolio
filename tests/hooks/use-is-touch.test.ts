import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsTouch } from '@/hooks/use-is-touch'

describe('useIsTouch', () => {
  it('returns true when pointer is coarse', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: q === '(pointer: coarse)',
        media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
        addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
      } as any)),
    })
    const { result } = renderHook(() => useIsTouch())
    expect(result.current).toBe(true)
  })
  it('returns false when pointer is fine', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: false, media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(),
        addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
      } as any)),
    })
    const { result } = renderHook(() => useIsTouch())
    expect(result.current).toBe(false)
  })
})
