import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusRibbon } from '@/components/ui/status-ribbon'

describe('StatusRibbon', () => {
  const props = {
    now: 'Operations Officer @ Kolosal AI',
    basedIn: 'Jakarta, Indonesia',
    education: 'B.Acc. · STIE YKPN · Apr 2026',
  }

  it('renders all three values', () => {
    render(<StatusRibbon {...props} />)
    expect(screen.getByText(/Operations Officer/)).toBeInTheDocument()
    expect(screen.getByText(/Jakarta/)).toBeInTheDocument()
    expect(screen.getByText(/STIE YKPN/)).toBeInTheDocument()
  })

  it('renders the three labels as mono caps', () => {
    render(<StatusRibbon {...props} />)
    expect(screen.getByText(/^Now$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Based in$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Education$/i)).toBeInTheDocument()
  })
})
