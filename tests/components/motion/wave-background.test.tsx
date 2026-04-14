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

  it('does not call requestAnimationFrame when reduced-motion is true', async () => {
    vi.resetModules()
    vi.doMock('@/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }))
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame')
    const mod = await import('@/components/motion/wave-background')
    render(<mod.WaveBackground />)
    expect(rafSpy).not.toHaveBeenCalled()
    rafSpy.mockRestore()
    vi.doUnmock('@/hooks/use-reduced-motion')
  })
})
