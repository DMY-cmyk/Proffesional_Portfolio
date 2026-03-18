import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from '@/app/error'

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ErrorPage', () => {
  const mockError = new Error('Something went wrong')
  const mockReset = vi.fn()

  it('renders an error heading', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/something went wrong/i)
  })

  it('renders a descriptive message', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument()
  })

  it('renders a try again button that calls reset', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const retryButton = screen.getByRole('button', { name: /try again|retry/i })
    fireEvent.click(retryButton)
    expect(mockReset).toHaveBeenCalledOnce()
  })

  it('renders a link back to home', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    const homeLink = screen.getByRole('link', { name: /home|back/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('is a client component (uses "use client")', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(__dirname, '../../src/app/error.tsx')
    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toMatch(/^['"]use client['"]/)
  })
})
