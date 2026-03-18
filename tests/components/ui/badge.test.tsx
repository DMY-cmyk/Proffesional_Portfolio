import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>TypeScript</Badge>)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders as a span element', () => {
    const { container } = render(<Badge>Tag</Badge>)
    expect(container.firstElementChild?.tagName).toBe('SPAN')
  })

  it('applies custom className', () => {
    const { container } = render(<Badge className="ml-2">Extra</Badge>)
    expect(container.firstElementChild?.className).toContain('ml-2')
  })
})