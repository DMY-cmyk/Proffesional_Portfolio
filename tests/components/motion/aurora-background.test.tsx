import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { AuroraBackground, throttleHandler, getParticleCount } from '@/components/motion/aurora-background'

let mockReducedMotion = false
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => mockReducedMotion,
}))

beforeEach(() => {
  mockReducedMotion = false
})

describe('AuroraBackground', () => {
  it('renders a canvas element', () => {
    const { container } = render(<AuroraBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('positions canvas as fixed background', () => {
    const { container } = render(<AuroraBackground />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('fixed')
    expect(wrapper?.className).toContain('inset-0')
  })

  it('returns null when user prefers reduced motion', () => {
    mockReducedMotion = true
    const { container } = render(<AuroraBackground />)
    expect(container.innerHTML).toBe('')
  })
})

describe('throttleHandler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the callback on first invocation', () => {
    const cb = vi.fn()
    const throttled = throttleHandler(cb, 16)
    throttled()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('suppresses calls within the interval', () => {
    const cb = vi.fn()
    const throttled = throttleHandler(cb, 16)
    let mockTime = 0
    vi.spyOn(performance, 'now').mockImplementation(() => mockTime)

    throttled() // t=0, fires
    mockTime = 5
    throttled() // t=5, suppressed
    mockTime = 10
    throttled() // t=10, suppressed

    expect(cb).toHaveBeenCalledTimes(1)

    mockTime = 20
    throttled() // t=20, fires (>16ms elapsed)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})

describe('getParticleCount', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns 20 for small screens (mobile)', () => {
    vi.stubGlobal('innerWidth', 375)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true })
    expect(getParticleCount()).toBe(20)
  })

  it('returns 40 for medium screens (tablet)', () => {
    vi.stubGlobal('innerWidth', 1024)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 4, configurable: true })
    expect(getParticleCount()).toBe(40)
  })

  it('returns 80 for large screens with many cores (desktop)', () => {
    vi.stubGlobal('innerWidth', 1920)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true })
    expect(getParticleCount()).toBe(80)
  })

  it('returns 20 for low-core devices regardless of screen size', () => {
    vi.stubGlobal('innerWidth', 1920)
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2, configurable: true })
    expect(getParticleCount()).toBe(20)
  })
})
