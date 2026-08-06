import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/',
}))
vi.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}))

import { CommandPalette } from '@/components/navigation/command-palette'

describe('CommandPalette', () => {
  beforeEach(() => { push.mockClear() })
  afterEach(() => cleanup())

  it('is closed by default and opens on Ctrl+K', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeInTheDocument()
  })

  it('filters commands as you type', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('resear')
    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThanOrEqual(1)
    expect(options.some((o) => /research/i.test(o.textContent ?? ''))).toBe(true)
    expect(options.some((o) => /contact/i.test(o.textContent ?? ''))).toBe(false)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates on Enter for an article command', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    // 'sustainability' matches only the research article title, so the
    // selected command is a page navigation (not a same-page '#' anchor)
    await user.keyboard('sustainability')
    await user.keyboard('{Enter}')
    expect(push).toHaveBeenCalledWith('/research/sustainability-reporting-firm-value')
  })

  it('opens via the open-command-palette window event', async () => {
    render(<CommandPalette />)
    const { act } = await import('@testing-library/react')
    await act(async () => {
      window.dispatchEvent(new Event('open-command-palette'))
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('traps Tab so focus stays on the input while open', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    await user.keyboard('{Control>}k{/Control}')
    const input = screen.getByRole('combobox', { name: /search commands/i })
    expect(input).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(input).toHaveFocus()
  })

  it('restores focus to the previously focused element after Escape', async () => {
    render(
      <div>
        <button>Trigger</button>
        <CommandPalette />
      </div>
    )
    const trigger = screen.getByRole('button', { name: /trigger/i })
    trigger.focus()
    expect(trigger).toHaveFocus()

    const { act } = await import('@testing-library/react')
    await act(async () => {
      window.dispatchEvent(new Event('open-command-palette'))
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
