import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act, cleanup } from '@testing-library/react'
import { useCondensedNav } from '@/hooks/use-condensed-nav'

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true })
  window.dispatchEvent(new Event('scroll'))
}

describe('useCondensedNav', () => {
  afterEach(() => {
    cleanup()
    scrollTo(0)
  })

  it('starts expanded at the top of the page', () => {
    scrollTo(0)
    const { result } = renderHook(() => useCondensedNav())
    expect(result.current).toBe(false)
  })

  it('condenses after scrolling past 88px', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    expect(result.current).toBe(true)
  })

  it('stays condensed inside the hysteresis band (72-88px)', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    act(() => scrollTo(80))
    expect(result.current).toBe(true)
  })

  it('expands again below 72px', () => {
    const { result } = renderHook(() => useCondensedNav())
    act(() => scrollTo(120))
    act(() => scrollTo(40))
    expect(result.current).toBe(false)
  })

  it('is condensed immediately when mounted mid-page', () => {
    scrollTo(300)
    const { result } = renderHook(() => useCondensedNav())
    expect(result.current).toBe(true)
  })
})
