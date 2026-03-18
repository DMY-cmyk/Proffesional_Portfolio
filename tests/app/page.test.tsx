import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Home page', () => {
  it('renders the hero section', () => {
    render(<Home />)
    expect(document.getElementById('hero')).toBeInTheDocument()
  })

  it('renders the about section', () => {
    render(<Home />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders the experience section', () => {
    render(<Home />)
    expect(document.getElementById('experience')).toBeInTheDocument()
  })

  it('renders the certifications section', () => {
    render(<Home />)
    expect(document.getElementById('certifications')).toBeInTheDocument()
  })

  it('renders the skills section', () => {
    render(<Home />)
    expect(document.getElementById('skills')).toBeInTheDocument()
  })

  it('renders the contact section', () => {
    render(<Home />)
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})