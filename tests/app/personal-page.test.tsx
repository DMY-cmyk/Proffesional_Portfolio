import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PersonalPage from '@/app/personal/page'

describe('/personal page', () => {
  it('renders the owner name as a heading', () => {
    render(<PersonalPage />)
    expect(screen.getByRole('heading', { name: /dzaki/i })).toBeInTheDocument()
  })
  it('renders Instagram link', () => {
    render(<PersonalPage />)
    const ig = screen.getByRole('link', { name: /instagram/i })
    expect(ig).toHaveAttribute('href', expect.stringContaining('instagram'))
  })
  it('renders TikTok link', () => {
    render(<PersonalPage />)
    const tt = screen.getByRole('link', { name: /tiktok/i })
    expect(tt).toHaveAttribute('href', expect.stringContaining('tiktok'))
  })
})
