'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function TimelineWithSpine({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.45'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[212px] hidden w-px bg-border md:block"
      />
      <motion.div
        data-testid="timeline-spine"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[212px] hidden w-px origin-top bg-accent md:block"
        style={reduced ? { scaleY: 1 } : { scaleY }}
      />
      {children}
    </div>
  )
}
