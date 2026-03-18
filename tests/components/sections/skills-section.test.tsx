import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillsSection } from '@/components/sections/skills-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('SkillsSection', () => {
  it('renders the Skills heading', () => {
    render(<SkillsSection />)
    expect(
      screen.getByRole('heading', { name: /skills & achievements/i })
    ).toBeInTheDocument()
  })

  it('renders skill categories', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Technical Skills')).toBeInTheDocument()
    expect(screen.getByText('Tools & Software')).toBeInTheDocument()
    expect(screen.getByText('Soft Skills')).toBeInTheDocument()
  })

  it('renders individual skill items as badges', () => {
    render(<SkillsSection />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
    expect(screen.getByText('Microsoft Excel')).toBeInTheDocument()
  })

  it('renders awards subsection', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/awards/i)).toBeInTheDocument()
  })

  it('renders courses subsection', () => {
    render(<SkillsSection />)
    expect(screen.getByText(/courses|training/i)).toBeInTheDocument()
  })

  it('has the skills section id', () => {
    render(<SkillsSection />)
    expect(document.getElementById('skills')).toBeInTheDocument()
  })
})