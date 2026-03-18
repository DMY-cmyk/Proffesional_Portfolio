import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    expect(container.firstElementChild?.className).toContain('p-8')
  })
})