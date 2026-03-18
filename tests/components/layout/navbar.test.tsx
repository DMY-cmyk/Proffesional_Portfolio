import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ThemeProvider } from '@/hooks/use-theme'
import { Navbar } from '@/components/layout/navbar'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('@/hooks/use-scroll-spy', () => ({
  useScrollSpy: () => 'about',
}))

describe('Navbar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the site logo/brand', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByText('DM')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
  })

  it('renders the theme toggle', () => {
    render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    )
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })
})