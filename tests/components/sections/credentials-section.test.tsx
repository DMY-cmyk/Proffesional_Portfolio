import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CredentialsSection } from '@/components/sections/credentials-section'

describe('CredentialsSection', () => {
  it('renders the Credentials heading', () => {
    render(<CredentialsSection />)
    expect(screen.getByRole('heading', { level: 2, name: /credentials/i })).toBeInTheDocument()
  })

  it('renders the IAI Brevet certification', () => {
    render(<CredentialsSection />)
    expect(screen.getByText(/Brevet A & B Taxation/i)).toBeInTheDocument()
    expect(screen.getByText(/Ikatan Akuntan Indonesia/i)).toBeInTheDocument()
  })

  it('renders the English Professional Development course', () => {
    render(<CredentialsSection />)
    expect(screen.getByText(/English for Professional Development/i)).toBeInTheDocument()
  })

  it('does not render an empty Awards subsection when awards are empty', () => {
    render(<CredentialsSection />)
    expect(screen.queryByText(/^Awards$/i)).not.toBeInTheDocument()
  })
})
