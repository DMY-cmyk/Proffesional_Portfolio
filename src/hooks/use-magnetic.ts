'use client'

import { useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useIsTouch } from '@/hooks/use-is-touch'

export function useMagnetic(maxOffset = 6) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 300, damping: 22 })
  const y = useSpring(rawY, { stiffness: 300, damping: 22 })
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()
  const enabled = !reduced && !isTouch

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      const relX = (e.clientX - rect.left) / rect.width - 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5
      rawX.set(relX * 2 * maxOffset)
      rawY.set(relY * 2 * maxOffset)
    },
    [enabled, maxOffset, rawX, rawY]
  )

  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { x, y, onPointerMove, onPointerLeave, enabled }
}
