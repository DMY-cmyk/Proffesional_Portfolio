import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { WaveBackground } from '@/components/motion/wave-background'

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

describe('WaveBackground', () => {
  it('renders a canvas with data-testid', () => {
    const { container } = render(<WaveBackground />)
    const canvas = container.querySelector('[data-testid="wave-background"]')
    expect(canvas).toBeTruthy()
    expect(canvas?.tagName).toBe('CANVAS')
  })
  it('renders fixed-position canvas with pointer-events-none', () => {
    const { container } = render(<WaveBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas?.className).toMatch(/fixed/)
    expect(canvas?.className).toMatch(/pointer-events-none/)
  })
})
