'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useIsTouch } from '@/hooks/use-is-touch'

interface Particle {
  x: number
  y: number
  born: number
}

export function CustomCursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isTouch || reduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Add class to <html> to hide native cursor
    document.documentElement.classList.add('custom-cursor-active')

    let w = 0
    let h = 0
    let rafId: number | null = null

    const pos = { x: 0, y: 0 }
    let hovering = false
    let particles: Particle[] = []

    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function onMouseMove(e: MouseEvent) {
      pos.x = e.clientX
      pos.y = e.clientY

      // Push particle at current position
      particles.push({ x: pos.x, y: pos.y, born: performance.now() })

      // Detect interactive element under cursor
      const el = document.elementFromPoint(pos.x, pos.y)
      hovering = !!(el?.closest('a,button,[role="button"]'))
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h)

      const now = performance.now()

      // Filter expired particles
      particles = particles.filter(p => now - p.born < 400)

      // Draw particle tail
      for (const p of particles) {
        const age = (now - p.born) / 400
        const alpha = (1 - age) * 0.7
        const r = 1.2 + (1 - age) * 4.5
        ctx.globalAlpha = alpha
        ctx.fillStyle = '#0d4f5c'
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Draw ring
      const ringR = hovering ? 36 : 24
      const ringColor = hovering ? 'rgba(184,148,74,1)' : 'rgba(13,79,92,0.85)'
      const ringWidth = hovering ? 2 : 1.5
      ctx.strokeStyle = ringColor
      ctx.lineWidth = ringWidth
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, ringR, 0, Math.PI * 2)
      ctx.stroke()

      // Draw center dot (hidden when hovering interactive element)
      if (!hovering) {
        ctx.fillStyle = '#0d4f5c'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function tick() {
      drawFrame()
      rafId = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    rafId = requestAnimationFrame(tick)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [isTouch, reduced])

  if (isTouch || reduced) return null

  return (
    <canvas
      ref={canvasRef}
      data-testid="custom-cursor"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
