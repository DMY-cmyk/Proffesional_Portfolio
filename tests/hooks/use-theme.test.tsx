import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@/hooks/use-theme'

function TestComponent() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => toggleTheme()}>Toggle</button>
    </div>
  )
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    cleanup()
  })

  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme').textContent).toBe('dark')
  })

  it('toggles to light theme', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    await user.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('theme').textContent).toBe('light')
  })

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    await user.click(screen.getByText('Toggle'))
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('adds dark class to documentElement for dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

describe('toggleTheme with view transitions', () => {
  const wrapper = ({ children }: React.PropsWithChildren) => <ThemeProvider>{children}</ThemeProvider>

  it('falls back to a plain toggle when startViewTransition is unavailable', () => {
    const { result } = renderHook(() => useTheme(), { wrapper })
    const before = result.current.theme
    act(() => result.current.toggleTheme({ x: 10, y: 10 }))
    expect(result.current.theme).not.toBe(before)
  })

  it('uses startViewTransition when available and origin given', () => {
    const ready = Promise.resolve()
    const svt = vi.fn((cb: () => void) => { cb(); return { ready } })
    ;(document as unknown as { startViewTransition: typeof svt }).startViewTransition = svt
    const { result } = renderHook(() => useTheme(), { wrapper })
    act(() => result.current.toggleTheme({ x: 10, y: 10 }))
    expect(svt).toHaveBeenCalledOnce()
    delete (document as unknown as { startViewTransition?: typeof svt }).startViewTransition
  })
})