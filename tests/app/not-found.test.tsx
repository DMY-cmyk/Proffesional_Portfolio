import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <a {...props}>{children}</a>,
    h1: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, initial, animate, exit, transition, whileHover, whileInView, whileTap, viewport, variants, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('NotFound (404)', () => {
  it('renders a 404 heading', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders a helpful message', () => {
    render(<NotFound />)
    expect(screen.getByText(/page.*not found|couldn.*find/i)).toBeInTheDocument()
  })

  it('renders a link back to home', () => {
    render(<NotFound />)
    const homeLink = screen.getByRole('link', { name: /home|back/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
