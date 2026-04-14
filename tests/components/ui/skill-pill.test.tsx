import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillPill } from '@/components/ui/skill-pill'

describe('SkillPill', () => {
  it('renders the skill name', () => {
    render(<SkillPill name="Financial Reporting" />)
    expect(screen.getByText('Financial Reporting')).toBeInTheDocument()
  })

  it('renders the context label when provided', () => {
    render(<SkillPill name="SAP" context="project" />)
    expect(screen.getByText(/project/i)).toBeInTheDocument()
  })

  it('omits the context label when not provided', () => {
    render(<SkillPill name="Excel" />)
    expect(screen.queryByText(/·/)).not.toBeInTheDocument()
  })

  it('never renders a percentage', () => {
    render(<SkillPill name="SPSS" context="research" />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })
})
