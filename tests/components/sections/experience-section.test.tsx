import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExperienceSection } from '@/components/sections/experience-section'

describe('ExperienceSection', () => {
  it('renders the Experience heading', () => {
    render(<ExperienceSection />)
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument()
  })

  it('renders current role marked as now', () => {
    render(<ExperienceSection />)
    expect(screen.getByText(/Operations Officer/i)).toBeInTheDocument()
    expect(screen.getByText(/present/i)).toBeInTheDocument()
  })

  it('renders the Tax Volunteer DJP role', () => {
    render(<ExperienceSection />)
    expect(screen.getByText(/Tax Volunteer/i)).toBeInTheDocument()
    expect(screen.getByText(/Direktorat Jenderal Pajak/i)).toBeInTheDocument()
  })

  it('does not render education entries (those are in EducationSection)', () => {
    render(<ExperienceSection />)
    expect(screen.queryByText(/Bachelor of Accounting/i)).not.toBeInTheDocument()
  })
})
