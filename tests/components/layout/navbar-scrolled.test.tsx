import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ThemeProvider } from '@/hooks/use-theme'
import { LanguageProvider } from '@/hooks/use-language'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, layoutId, initial, animate, exit, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'about',
}))

vi.mock('@/hooks/use-scroll-progress', () => ({
  useScrollProgress: () => 0.2,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/hooks/use-condensed-nav', () => ({
  useCondensedNav: () => true,
}))

describe('Navbar (condensed state)', () => {
  afterEach(() => {
    cleanup()
  })

  it('marks the header as condensed', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(document.querySelector('header')?.dataset.condensed).toBe('true')
  })

  it('shortens the CV label to CV', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    const cv = document.querySelector('a[download]')
    expect(cv?.textContent?.trim()).toBe('CV')
  })

  it('hides the brand tagline when condensed', async () => {
    const { Navbar } = await import('@/components/layout/navbar')
    const { queryByText } = render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(queryByText('Accounting · Research')).toBeNull()
  })
})
