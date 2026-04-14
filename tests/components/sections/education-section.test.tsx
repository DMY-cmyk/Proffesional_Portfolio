import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EducationSection } from '@/components/sections/education-section'

describe('EducationSection', () => {
  it('renders Education heading', () => {
    render(<EducationSection />)
    expect(screen.getByRole('heading', { level: 2, name: /education/i })).toBeInTheDocument()
  })
  it('renders the Bachelor of Accounting degree', () => {
    render(<EducationSection />)
    expect(screen.getByText(/Bachelor of Accounting/i)).toBeInTheDocument()
  })
  it('renders the school STIE YKPN', () => {
    render(<EducationSection />)
    expect(screen.getByText(/STIE YKPN/i)).toBeInTheDocument()
  })
  it('renders each education bullet including the thesis pointer', () => {
    render(<EducationSection />)
    expect(screen.getByText(/Thesis:/i)).toBeInTheDocument()
  })
})
