import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-scroll-progress', () => ({ useScrollProgress: () => 0.4 }))

import { ReadingProgress } from '@/components/research/reading-progress'

describe('ReadingProgress', () => {
  afterEach(() => cleanup())
  it('renders a progressbar reflecting scroll progress', () => {
    render(<ReadingProgress />)
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('40')
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('40%')
  })
})
