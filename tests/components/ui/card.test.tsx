import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '@/components/ui/card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders as a div by default', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders as an anchor when href is provided', () => {
    render(<Card href="/details"><p>Linked card</p></Card>)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/details')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="p-8"><p>Content</p></Card>)
    const cardElement = container.querySelector('.p-8')
    expect(cardElement).toBeInTheDocument()
  })

  it('has border and transition classes', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain('border')
    expect(card.className).toContain('transition-all')
  })

  it('has no glow overlay element', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 })
    const glowDiv = card.querySelector('.pointer-events-none')
    expect(glowDiv).not.toBeInTheDocument()
  })

  it('includes hover shadow class', () => {
    const { container } = render(<Card>x</Card>)
    const cls = (container.firstChild as HTMLElement).className
    expect(cls).toMatch(/hover:shadow-\[0_8px_24px/)
  })
})