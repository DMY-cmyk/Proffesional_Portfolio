import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResearchDetailPage from '@/app/research/[slug]/page'

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div>{source}</div>,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ResearchDetailPage', () => {
  it('renders research title', async () => {
    const page = await ResearchDetailPage({
      params: Promise.resolve({ slug: 'sustainability-reporting-firm-value' }),
    })
    render(page)
    expect(
      screen.getByRole('heading', { name: /keberlanjutan|sustainability/i })
    ).toBeInTheDocument()
  })
})
