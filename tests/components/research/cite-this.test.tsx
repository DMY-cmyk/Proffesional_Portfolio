import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CiteThis } from '@/components/research/cite-this'

const citation = {
  authorName: 'Dzaki Muhammad Yusfian',
  title: 'Sample Thesis Title',
  year: '2026',
  institution: 'STIE YKPN',
  kind: 'thesis',
}

describe('CiteThis', () => {
  beforeEach(() => {
    // Setup clipboard for first test (render test doesn't use userEvent)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    })
  })
  afterEach(() => cleanup())

  it('renders APA and BibTeX outputs', () => {
    render(<CiteThis citation={citation} />)
    expect(screen.getByText(/Yusfian, D\. M\. \(2026\)\./)).toBeInTheDocument()
    expect(screen.getByText(/@thesis\{yusfian2026/)).toBeInTheDocument()
  })

  it('copies APA text and shows feedback', async () => {
    const user = userEvent.setup()
    render(<CiteThis citation={citation} />)
    await user.click(screen.getByRole('button', { name: /copy apa/i }))
    // userEvent.setup() provides a functional clipboard stub with readText()
    expect(await navigator.clipboard.readText()).toContain('Yusfian, D. M. (2026).')
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
