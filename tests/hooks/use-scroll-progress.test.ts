import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useScrollProgress } from '@/hooks/use-scroll-progress'

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  })

  it('returns 0 initially', () => {
    const { result } = renderHook(() => useScrollProgress())
    expect(result.current).toBe(0)
  })

  it('updates on scroll', () => {
    const { result } = renderHook(() => useScrollProgress())

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe(0.5)
  })
})
