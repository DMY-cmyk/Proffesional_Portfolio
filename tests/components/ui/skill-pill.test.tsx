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

describe('SkillPill filtering', () => {
  it('applies dim classes when filterContext is set and does not match', () => {
    const { container } = render(<SkillPill name="Excel" context="daily" filterContext="applied" />)
    expect(container.firstChild).toHaveClass('opacity-[0.22]')
    expect(container.firstChild).toHaveClass('scale-[0.96]')
  })
  it('applies match classes when filterContext matches this context', () => {
    const { container } = render(<SkillPill name="SAP" context="project" filterContext="project" />)
    expect(container.firstChild).toHaveClass('border-accent')
  })
  it('treats filterContext="none" as matching undefined context', () => {
    const { container } = render(<SkillPill name="Communication" filterContext="none" />)
    expect(container.firstChild).toHaveClass('border-accent')
  })
  it('treats filterContext="none" as dim for pills with a context', () => {
    const { container } = render(<SkillPill name="Excel" context="daily" filterContext="none" />)
    expect(container.firstChild).toHaveClass('opacity-[0.22]')
  })
  it('applies default classes when filterContext="all"', () => {
    const { container } = render(<SkillPill name="Excel" context="daily" filterContext="all" />)
    expect(container.firstChild).not.toHaveClass('opacity-[0.22]')
    expect(container.firstChild).not.toHaveClass('border-accent')
  })
  it('applies default classes when filterContext is undefined', () => {
    const { container } = render(<SkillPill name="Excel" context="daily" />)
    expect(container.firstChild).not.toHaveClass('opacity-[0.22]')
    expect(container.firstChild).not.toHaveClass('border-accent')
  })
})
