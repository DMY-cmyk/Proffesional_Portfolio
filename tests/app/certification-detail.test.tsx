import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CertificationDetailPage from '@/app/certifications/[slug]/page'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('CertificationDetailPage', () => {
  it('renders certification name', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    expect(
      screen.getByRole('heading', { name: /brevet/i })
    ).toBeInTheDocument()
  })

  it('renders issuer information', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    expect(screen.getByText(/IAI/i)).toBeInTheDocument()
  })

  it('renders document viewer link', async () => {
    const page = await CertificationDetailPage({
      params: Promise.resolve({ slug: 'brevet-ab' }),
    })
    render(page)
    const viewLink = screen.getByRole('link', { name: /view|document|certificate/i })
    expect(viewLink).toHaveAttribute('href', expect.stringContaining('.pdf'))
  })
})
