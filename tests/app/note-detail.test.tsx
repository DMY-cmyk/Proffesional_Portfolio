import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NoteDetailPage from '@/app/notes/[slug]/page'

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div>{source}</div>,
}))

describe('NoteDetailPage', () => {
  it('renders the note title', async () => {
    const page = await NoteDetailPage({
      params: Promise.resolve({ slug: 'reading-sustainability-reports' }),
    })
    render(page)
    expect(
      screen.getByRole('heading', { name: /sustainability report/i })
    ).toBeInTheDocument()
  })

  it('wraps the MDX body in the article-body typography layer', async () => {
    const page = await NoteDetailPage({
      params: Promise.resolve({ slug: 'reading-sustainability-reports' }),
    })
    const { container } = render(page)
    const body = container.querySelector('.article-body')
    expect(body).not.toBeNull()
    expect(body!.className).not.toContain('prose')
  })
})
