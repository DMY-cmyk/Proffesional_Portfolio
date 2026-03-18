import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from '@/components/ui/timeline-item'

describe('TimelineItem', () => {
  it('renders title, subtitle, and date range', () => {
    render(
      <TimelineItem
        title="Software Engineer"
        subtitle="Acme Corp"
        dateRange="Jan 2023 — Present"
      >
        <p>Built stuff</p>
      </TimelineItem>
    )
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Jan 2023 — Present')).toBeInTheDocument()
    expect(screen.getByText('Built stuff')).toBeInTheDocument()
  })

  it('renders connector line when not last item', () => {
    const { container } = render(
      <TimelineItem title="Role" subtitle="Company" dateRange="2023">
        <p>Details</p>
      </TimelineItem>
    )
    const connector = container.querySelector('.bg-border')
    expect(connector).toBeInTheDocument()
  })

  it('hides connector line when isLast is true', () => {
    const { container } = render(
      <TimelineItem title="Role" subtitle="Company" dateRange="2023" isLast>
        <p>Details</p>
      </TimelineItem>
    )
    const connectors = container.querySelectorAll('.bg-border')
    expect(connectors.length).toBe(0)
  })
})