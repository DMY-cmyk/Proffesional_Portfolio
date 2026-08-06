'use client'

import { useScrollProgress } from '@/hooks/use-scroll-progress'

export function ReadingProgress() {
  const progress = useScrollProgress()
  const percent = Math.round(progress * 100)

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed left-0 right-0 top-0 z-40 h-0.5 bg-transparent"
    >
      <div className="h-full bg-accent transition-none" style={{ width: `${percent}%` }} />
    </div>
  )
}
