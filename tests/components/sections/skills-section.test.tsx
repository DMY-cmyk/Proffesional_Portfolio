import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SkillsSection } from '@/components/sections/skills-section'

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('SkillsSection (redesigned)', () => {
  it('renders the Skills heading', () => {
    render(<SkillsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument()
  })

  it('renders the three category labels', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/^Technical$/i)).toBeInTheDocument()
    expect(screen.getByText(/Tools & Software/i)).toBeInTheDocument()
    expect(screen.getByText(/Research & Soft/i)).toBeInTheDocument()
  })

  it('renders some skills', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
    expect(screen.getByText('Microsoft Excel')).toBeInTheDocument()
  })

  it('does NOT render any percentage text', () => {
    const { container } = render(<SkillsSection />)
    expect(container.textContent).not.toMatch(/\d{2,3}%/)
  })

  it('does NOT render any progress bar elements', () => {
    const { container } = render(<SkillsSection />)
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(0)
  })

  it('renders context labels where provided', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/· daily/i)).toBeInTheDocument()
  })

  it('renders the filter pill row', () => {
    render(<SkillsSection />)
    expect(screen.getByRole('group', { name: /filter skills/i })).toBeInTheDocument()
  })
  it('dims non-matching skills when a filter pill is clicked', () => {
    render(<SkillsSection />)
    const applied = screen.getByRole('button', { name: /^applied/i })
    fireEvent.click(applied)
    const excel = screen.getByText('Microsoft Excel').closest('span')
    expect(excel).toHaveClass('opacity-[0.22]')
  })
})
