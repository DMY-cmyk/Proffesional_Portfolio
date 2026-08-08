import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotesPage from '@/app/notes/page'

describe('NotesPage', () => {
  it('renders the notes listing heading', () => {
    render(<NotesPage />)
    expect(screen.getByRole('heading', { level: 1, name: /notes/i })).toBeInTheDocument()
  })

  it('sets note summaries in the serif reading voice', () => {
    render(<NotesPage />)
    const summary = screen.getByText(/plain-language walkthrough/i)
    expect(summary.className).toContain('font-display')
  })
})
