import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/hooks/use-theme'
import { LanguageProvider } from '@/hooks/use-language'
import { Navbar } from '@/components/layout/navbar'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, layoutId, initial, animate, exit, transition, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
}))

vi.mock('@/hooks/use-condensed-nav', () => ({
  useCondensedNav: () => false,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'about',
}))

vi.mock('@/hooks/use-scroll-progress', () => ({
  useScrollProgress: () => 0,
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navbar', () => {
  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('renders the site logo/brand', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByRole('link', { name: /dzaki yusfian — home/i })).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getAllByText('Research').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the theme toggle', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeInTheDocument()
  })

  it('renders a scroll progress bar', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(document.querySelector('[data-testid="scroll-progress"]')).toBeInTheDocument()
  })

  it('is a full-width masthead, not a floating pill', () => {
    const { container } = render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    const header = container.querySelector('header')
    expect(header?.className).not.toMatch(/rounded/)
    expect(header?.className).toContain('inset-x-0')
  })

  it('does not render a search button in the header', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.queryByRole('button', { name: /search and navigate/i })).toBeNull()
  })

  it('renders the ink rule with the scroll progress fill at the bottom edge', () => {
    const { container } = render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    const progress = container.querySelector('[data-testid="scroll-progress"]')
    expect(progress?.parentElement?.className).toContain('bg-foreground')
  })

  it('renders a persistent Download CV link', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    const cv = screen.getByRole('link', { name: /download cv/i })
    expect(cv.getAttribute('href')).toMatch(/\/files\/cv\//)
  })

  it('renders localized nav labels when switching to Indonesian', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /beralih ke bahasa indonesia/i }))
    expect(screen.getAllByText('Pendidikan').length).toBeGreaterThanOrEqual(1)
  })

  it('shows exactly one Research link (deduped)', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getAllByText('Research')).toHaveLength(1)
  })

  it('renders the editorial brand tagline', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByText('Accounting · Research')).toBeInTheDocument()
  })

  it('renders the Notes page link', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </LanguageProvider>
    )
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })
})