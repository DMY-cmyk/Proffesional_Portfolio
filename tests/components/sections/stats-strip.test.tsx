import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/hooks/use-count-up', () => ({
  useCountUp: (target: number) => ({ value: target, ref: { current: null }, attach: () => {} }),
}))

import { StatsStrip } from '@/components/sections/stats-strip'
import { getStats } from '@/data/content'

describe('StatsStrip', () => {
  afterEach(() => cleanup())

  it('renders one figure per stat with its label', () => {
    render(<StatsStrip />)
    for (const stat of getStats()) {
      expect(screen.getByText(stat.label)).toBeInTheDocument()
    }
  })

  it('renders numeric values (mocked to final)', () => {
    render(<StatsStrip />)
    const certs = getStats().find((s) => s.label === 'Certifications')!
    const matches = screen.getAllByText(new RegExp(`^${certs.value}`))
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
