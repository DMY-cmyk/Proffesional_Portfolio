import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactSection } from '@/components/sections/contact-section'

describe('ContactSection', () => {
  it('renders the Contact heading', () => {
    render(<ContactSection />)
    expect(
      screen.getByRole('heading', { name: /get in touch/i })
    ).toBeInTheDocument()
  })

  it('renders email link', () => {
    render(<ContactSection />)
    const emailLink = screen.getByRole('link', { name: /email/i })
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })

  it('renders LinkedIn link', () => {
    render(<ContactSection />)
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin'))
  })

  it('renders download buttons', () => {
    render(<ContactSection />)
    expect(screen.getByText(/download cv/i)).toBeInTheDocument()
  })

  it('has the contact section id', () => {
    render(<ContactSection />)
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})