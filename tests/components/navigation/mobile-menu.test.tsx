import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('MobileMenu', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders hamburger button', () => {
    render(<MobileMenu items={mockItems} />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('shows menu items when opened', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={mockItems} />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('closes when a link is clicked', async () => {
    const user = userEvent.setup()
    render(<MobileMenu items={mockItems} />)
    await user.click(screen.getByRole('button', { name: /open menu/i }))
    await user.click(screen.getByText('About'))
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })
})