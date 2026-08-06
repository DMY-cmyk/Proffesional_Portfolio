import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const mockState = vi.hoisted(() => ({ reduced: false, touch: false }))

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => mockState.reduced,
}))
vi.mock('@/hooks/use-is-touch', () => ({
  useIsTouch: () => mockState.touch,
}))

import { useMagnetic } from '@/hooks/use-magnetic'

describe('useMagnetic', () => {
  it('is enabled on fine pointers without reduced motion', () => {
    mockState.reduced = false
    mockState.touch = false
    const { result } = renderHook(() => useMagnetic())
    expect(result.current.enabled).toBe(true)
  })

  it('is disabled on touch devices and offsets stay 0', () => {
    mockState.reduced = false
    mockState.touch = true
    const { result } = renderHook(() => useMagnetic())
    expect(result.current.enabled).toBe(false)
    act(() => {
      result.current.onPointerMove({
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 40 }),
        },
        clientX: 90,
        clientY: 35,
      } as unknown as React.PointerEvent<HTMLElement>)
    })
    expect(result.current.x.get()).toBe(0)
    expect(result.current.y.get()).toBe(0)
  })
})
