import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/hooks/use-theme'
import { ThemeToggle } from '@/components/ui/theme-toggle'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    cleanup()
  })

  it('renders a toggle button with accessible label', () => {
    renderWithTheme()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    renderWithTheme()
    const button = screen.getByRole('button')
    await user.click(button)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})