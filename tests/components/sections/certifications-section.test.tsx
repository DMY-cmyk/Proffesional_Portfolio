import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CertificationsSection } from '@/components/sections/certifications-section'

describe('CertificationsSection', () => {
  it('renders the Certifications heading', () => {
    render(<CertificationsSection />)
    expect(
      screen.getByRole('heading', { name: /certifications/i })
    ).toBeInTheDocument()
  })

  it('renders certification cards', () => {
    render(<CertificationsSection />)
    expect(screen.getAllByText(/brevet|cpa|certification/i).length).toBeGreaterThan(0)
  })

  it('renders issuer and date for each certification', () => {
    render(<CertificationsSection />)
    expect(screen.getByText(/IAI|institute/i)).toBeInTheDocument()
  })

  it('renders links to certification detail pages', () => {
    render(<CertificationsSection />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    expect(links[0].getAttribute('href')).toContain('/certifications/')
  })

  it('has the certifications section id', () => {
    render(<CertificationsSection />)
    expect(document.getElementById('certifications')).toBeInTheDocument()
  })
})