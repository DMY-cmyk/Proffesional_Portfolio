'use client'

import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3)

export function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)
  const reduced = useReducedMotion()

  const attach = useCallback(
    (el: HTMLSpanElement | null) => {
      ref.current = el
      if (!el || startedRef.current) return
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting) || startedRef.current) return
        startedRef.current = true
        io.disconnect()
        if (reduced) {
          setValue(target)
          return
        }
        const t0 = performance.now()
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / durationMs)
          setValue(Math.round(EASE_OUT(p) * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }, { threshold: 0.4 })
      io.observe(el)
    },
    [target, durationMs, reduced]
  )

  return { value, ref, attach }
}
