import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileSection } from '@/components/sections/profile-section'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ProfileSection', () => {
  it('renders the About Me heading', () => {
    render(<ProfileSection />)
    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
  })

  it('renders section number 01', () => {
    render(<ProfileSection />)
    expect(screen.getByText(/01/)).toBeInTheDocument()
  })

  it('renders the bio text', () => {
    render(<ProfileSection />)
    expect(screen.getByText(/specializing|tax|audit/i)).toBeInTheDocument()
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