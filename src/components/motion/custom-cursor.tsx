'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function CustomCursor() {
  const prefersReduced = useReducedMotion()
  const [isPointerDevice, setIsPointerDevice] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 300 }
  const ringX = useSpring(cursorX, springConfig)
  const ringY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)')
    setIsPointerDevice(mql.matches)
  }, [])

  useEffect(() => {
    if (!isPointerDevice || prefersReduced) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      setIsHovering(!!isInteractive)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isPointerDevice, prefersReduced, cursorX, cursorY])

  if (!isPointerDevice || prefersReduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-gold-500"
        style={{
          x: ringX,
          y: ringY,
          width: isHovering ? 40 : 24,
          height: isHovering ? 40 : 24,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
          transition: 'width 0.2s, height 0.2s, background-color 0.2s',
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-gold-500"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  )
}
