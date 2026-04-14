import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsFilter } from '@/components/sections/skills-filter'

const categories = [
  { category: 'Technical', items: [{ name: 'X', context: 'applied' }, { name: 'Y', context: 'applied' }] },
  { category: 'Soft', items: [{ name: 'Z' }] },
]

describe('SkillsFilter', () => {
  it('renders All pill with total count', () => {
    render(<SkillsFilter categories={categories} active="all" onChange={vi.fn()} />)
    const all = screen.getByRole('button', { name: /all.*3/i })
    expect(all).toBeInTheDocument()
  })
  it('renders a pill per distinct context plus a no-context pill', () => {
    render(<SkillsFilter categories={categories} active="all" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /applied.*2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /no context.*1/i })).toBeInTheDocument()
  })
  it('sets aria-pressed="true" on the active pill', () => {
    render(<SkillsFilter categories={categories} active="applied" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /applied.*2/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /all.*3/i })).toHaveAttribute('aria-pressed', 'false')
  })
  it('calls onChange with the clicked pill key', () => {
    const onChange = vi.fn()
    render(<SkillsFilter categories={categories} active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /applied.*2/i }))
    expect(onChange).toHaveBeenCalledWith('applied')
  })
})
