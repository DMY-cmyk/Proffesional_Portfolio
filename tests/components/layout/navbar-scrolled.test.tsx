import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ThemeProvider } from '@/hooks/use-theme'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, layoutId, initial, animate, exit, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'about',
}))

vi.mock('@/hooks/use-scroll-progress', () => ({
  useScrollProgress: () => 0.2,
}))

describe('Navbar (scrolled state)', () => {
  afterEach(() => {
    cleanup()
  })

  it('applies deeper shadow when scrolled', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    const header = document.querySelector('header')
    expect(header?.className).toMatch(/shadow-\[0_4px_16px/)
  })
})
