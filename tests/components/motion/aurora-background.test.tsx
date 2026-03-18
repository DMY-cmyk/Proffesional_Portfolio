import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { AuroraBackground } from '@/components/motion/aurora-background'

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
