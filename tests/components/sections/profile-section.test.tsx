import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileSection } from '@/components/sections/profile-section'

describe('ProfileSection', () => {
  it('renders the About Me heading', () => {
    render(<ProfileSection />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })

  it('renders the bio text', () => {
    render(<ProfileSection />)
    expect(screen.getByText(/accounting|finance|professional/i)).toBeInTheDocument()
  })

  it('renders the brand statement as a blockquote', () => {
    const { container } = render(<ProfileSection />)
    const blockquote = container.querySelector('blockquote')
    expect(blockquote).toBeInTheDocument()
    expect(blockquote?.textContent).toBeTruthy()
  })

  it('has the about section id', () => {
    render(<ProfileSection />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })
})