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

  it('shows glow element on mouse move', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 })
    const glowDiv = card.querySelector('.pointer-events-none')
    expect(glowDiv).toBeInTheDocument()
  })

  it('hides glow element on mouse leave', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 })
    fireEvent.mouseLeave(card)
    const glowDiv = card.querySelector('.pointer-events-none')
    expect(glowDiv).not.toBeInTheDocument()
  })

  it('has glass-morphism related classes', () => {
    const { container } = render(<Card><p>Content</p></Card>)
    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain('overflow-hidden')
    expect(card.className).toContain('relative')
  })
})