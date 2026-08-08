import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MdxOl, MdxUl } from '@/components/research/mdx-list'

describe('MdxOl / MdxUl', () => {
  it('renders an ordered list with an explicit list role', () => {
    render(<MdxOl><li>one</li></MdxOl>)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
  })
  it('renders an unordered list with an explicit list role', () => {
    render(<MdxUl><li>one</li></MdxUl>)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
  })
  it('passes through additional props', () => {
    render(<MdxOl start={3}><li>three</li></MdxOl>)
    expect(screen.getByRole('list')).toHaveAttribute('start', '3')
  })
})
