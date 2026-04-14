import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
