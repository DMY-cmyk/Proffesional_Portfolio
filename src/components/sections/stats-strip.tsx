'use client'

import { getStats } from '@/data/content'
import { useCountUp } from '@/hooks/use-count-up'

function StatFigure({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { value: shown, attach } = useCountUp(value)
  return (
    <div className="flex flex-col items-center gap-1 py-2 text-center">
      <span ref={attach} className="font-display text-3xl font-medium text-accent md:text-4xl">
        {shown}
        {suffix ?? ''}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-widest text-subtle">{label}</span>
    </div>
  )
}

export function StatsStrip() {
  const stats = getStats()
  return (
    <section aria-label="Key figures" className="border-y border-border bg-surface-alt/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-6 py-6 md:grid-cols-4">
        {stats.map((s) => (
          <StatFigure key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}
