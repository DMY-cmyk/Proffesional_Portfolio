import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-scroll-spy', () => ({ useScrollSpy: () => 'method' }))

import { TableOfContents } from '@/components/research/table-of-contents'

const headings = [
  { id: 'research-question', text: 'Research Question', level: 2 as const },
  { id: 'method', text: 'Method', level: 2 as const },
  { id: 'sub-point', text: 'Sub point', level: 3 as const },
]

describe('TableOfContents', () => {
  afterEach(() => cleanup())

  it('renders a labeled nav with one link per heading', () => {
    render(<TableOfContents headings={headings} />)
    const nav = screen.getByRole('navigation', { name: /table of contents/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Method' }).getAttribute('href')).toBe('#method')
  })

  it('marks the active heading', () => {
    render(<TableOfContents headings={headings} />)
    expect(screen.getByRole('link', { name: 'Method' }).className).toContain('text-accent')
    expect(screen.getByRole('link', { name: 'Research Question' }).className).not.toContain('text-accent')
  })

  it('renders nothing for fewer than 2 headings', () => {
    const { container } = render(<TableOfContents headings={[headings[0]]} />)
    expect(container.innerHTML).toBe('')
  })
})
