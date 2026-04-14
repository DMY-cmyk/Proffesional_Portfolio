import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResearchPage from '@/app/research/page'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ResearchPage', () => {
  it('renders Research heading', () => {
    render(<ResearchPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /research/i })
    ).toBeInTheDocument()
  })

  it('renders research entry cards', () => {
    render(<ResearchPage />)
    expect(
      screen.getByRole('heading', { level: 3, name: /sustainability report disclosure/i })
    ).toBeInTheDocument()
  })

  it('renders links to individual research pages', () => {
    render(<ResearchPage />)
    const links = screen.getAllByRole('link')
    const researchLinks = links.filter((l) =>
      l.getAttribute('href')?.includes('/research/')
    )
    expect(researchLinks.length).toBeGreaterThan(0)
  })
})
