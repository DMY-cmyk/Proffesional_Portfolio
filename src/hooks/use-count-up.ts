'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3)

export function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)
  const startedRef = useRef(false)
  const reduced = useReducedMotion()
  // Read the latest reduced-motion preference from inside the observer
  // callback instead of closing over the value at attach() time, so a
  // preference change that lands between "observer created" and
  // "observer fires" is still honored.
  const reducedRef = useRef(reduced)
  const ioRef = useRef<IntersectionObserver | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    reducedRef.current = reduced
  }, [reduced])

  const cleanup = useCallback(() => {
    ioRef.current?.disconnect()
    ioRef.current = null
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // Guarantee the observer/rAF are torn down on unmount even if the ref
  // callback never runs with `null` (e.g. the element is removed as part
  // of the whole component tree unmounting).
  useEffect(() => cleanup, [cleanup])

  const attach = useCallback(
    (el: HTMLSpanElement | null) => {
      ref.current = el
      if (!el) {
        cleanup()
        return
      }
      if (startedRef.current) return
      const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting) || startedRef.current) return
        startedRef.current = true
        io.disconnect()
        ioRef.current = null
        if (reducedRef.current) {
          setValue(target)
          return
        }
        const t0 = performance.now()
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / durationMs)
          setValue(Math.round(EASE_OUT(p) * target))
          if (p < 1) {
            rafRef.current = requestAnimationFrame(step)
          } else {
            rafRef.current = null
          }
        }
        rafRef.current = requestAnimationFrame(step)
      }, { threshold: 0.4 })
      ioRef.current = io
      io.observe(el)
    },
    // Intentionally excludes `reduced`: the observer must not be torn down
    // and recreated just because the preference flips — reducedRef above
    // carries the latest value into the (possibly already-fired-later)
    // observer callback.
    [target, durationMs, cleanup]
  )

  return { value, ref, attach }
}
