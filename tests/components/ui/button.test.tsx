import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('renders as an anchor element when href is provided', () => {
    render(<Button href="/about">Go</Button>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/about')
  })

  it('opens external links in new tab', () => {
    render(<Button href="https://example.com" external>External</Button>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button').className).toContain('bg-foreground')
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button').className).toContain('border')
  })

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).not.toContain('bg-gold')
    expect(btn.className).not.toContain('border-gold')
  })

  it('has core layout classes', () => {
    render(<Button>Styled</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('inline-flex')
    expect(btn.className).toContain('rounded-md')
  })

  it('renders children inside the button', () => {
    render(<Button>Shine</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Shine')
  })

  it('calls onClick handler', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})