'use client'
import { useEffect, useState, type RefObject } from 'react'

export function useViewportVisible(
  ref: RefObject<Element | null>,
  rootMargin = '0px'
): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, rootMargin])
  return visible
}
