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
})
