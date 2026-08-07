import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '@/hooks/use-language'
import { MobileMenu } from '@/components/navigation/mobile-menu'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

const mockItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
]

const mockItemsWithPage = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Notes', href: '/notes' },
]

describe('MobileMenu', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders hamburger button', () => {
    render(
      <LanguageProvider>
        <MobileMenu items={mockItems} />
      </LanguageProvider>
    )
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('shows menu items when opened', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItems} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('closes when a link is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItems} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.click(screen.getByText('About'))
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('groups links under Sections and Pages labels', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('Sections')).toBeInTheDocument()
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('renders a CV download link inside the menu', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    const cv = screen.getByRole('link', { name: /download cv/i })
    expect(cv.getAttribute('href')).toMatch(/\/files\/cv\//)
  })

  it('rewrites section anchors when off the homepage', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} pathname="/notes" />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('About').getAttribute('href')).toBe('/#about')
  })

  it('hides on large screens instead of medium', () => {
    const { container } = render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    expect(container.firstElementChild?.className).toContain('lg:hidden')
  })

  it('moves focus into the dialog when opened', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MobileMenu items={mockItemsWithPage} />
      </LanguageProvider>
    )
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('dialog')).toHaveFocus()
  })
})