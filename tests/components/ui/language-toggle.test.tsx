import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '@/hooks/use-language'
import { LanguageToggle } from '@/components/ui/language-toggle'

function renderToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  )
}

describe('LanguageToggle', () => {
  afterEach(() => {
    cleanup()
    localStorage.removeItem('lang')
  })

  it('renders EN and ID buttons with EN active by default', () => {
    renderToggle()
    const en = screen.getByRole('button', { name: /english/i })
    const id = screen.getByRole('button', { name: /indonesia/i })
    expect(en.getAttribute('aria-pressed')).toBe('true')
    expect(id.getAttribute('aria-pressed')).toBe('false')
  })

  it('switches to ID on click and persists', async () => {
    const user = userEvent.setup()
    renderToggle()
    await user.click(screen.getByRole('button', { name: /indonesia/i }))
    expect(screen.getByRole('button', { name: /indonesia/i }).getAttribute('aria-pressed')).toBe('true')
    expect(localStorage.getItem('lang')).toBe('id')
  })

  it('renders as quiet text without a bordered box', () => {
    const { container } = renderToggle()
    const group = container.querySelector('[role="group"]')
    expect(group?.className).not.toContain('border')
  })

  it('underlines the active language', () => {
    renderToggle()
    const active = screen.getByRole('button', { name: /switch to english/i })
    expect(active.className).toContain('underline')
  })

  it('separates languages with a decorative slash', () => {
    const { container } = renderToggle()
    const slash = container.querySelector('[aria-hidden="true"]')
    expect(slash?.textContent).toBe('/')
  })
})
