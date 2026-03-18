'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface AuroraWave {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  baseRadius: number
  dx: number
  dy: number
  r: number
  g: number
  b: number
  opacity: number
  phase: number
  pulseSpeed: number
}

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  opacity: number
  flickerPhase: number
  flickerSpeed: number
}

function createWaves(width: number, height: number): AuroraWave[] {
  const configs = [
    { r: 212, g: 175, b: 55, opacity: 0.12 },
    { r: 229, g: 193, b: 88, opacity: 0.09 },
    { r: 184, g: 148, b: 31, opacity: 0.10 },
    { r: 212, g: 175, b: 55, opacity: 0.07 },
    { r: 154, g: 117, b: 24, opacity: 0.08 },
    { r: 200, g: 160, b: 40, opacity: 0.06 },
    { r: 240, g: 210, b: 100, opacity: 0.05 },
  ]

  return configs.map(({ r, g, b, opacity }) => {
    const x = Math.random() * width
    const y = Math.random() * height
    return {
      x, y,
      baseX: x,
      baseY: y,
      radius: 250 + Math.random() * 350,
      baseRadius: 250 + Math.random() * 350,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.3,
      r, g, b, opacity,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.003 + Math.random() * 0.004,
    }
  })
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 0.15,
    dy: -0.1 - Math.random() * 0.2,
    size: 1 + Math.random() * 2,
    opacity: 0.15 + Math.random() * 0.35,
    flickerPhase: Math.random() * Math.PI * 2,
    flickerSpeed: 0.02 + Math.random() * 0.03,
  }))
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()
  const mouseRef = useRef({ x: -1, y: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let waves: AuroraWave[]
    let particles: Particle[]
    let tick = 0

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      waves = createWaves(canvas!.width, canvas!.height)
      particles = createParticles(canvas!.width, canvas!.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    function draw() {
      const w = canvas!.width
      const h = canvas!.height
      tick++

      ctx!.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const hasMouse = mx >= 0

      // Draw waves with pulsing radii and mouse attraction
      waves.forEach((wave) => {
        wave.phase += wave.pulseSpeed
        const pulse = Math.sin(wave.phase) * 0.15
        wave.radius = wave.baseRadius * (1 + pulse)

        // Mouse attraction: gently pull waves toward cursor
        if (hasMouse) {
          const ddx = mx - wave.x
          const ddy = my - wave.y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          const pull = Math.min(0.3, 80 / (dist + 200))
          wave.x += ddx * pull * 0.008
          wave.y += ddy * pull * 0.008
        }

        wave.x += wave.dx
        wave.y += wave.dy

        // Wrap around
        if (wave.x < -wave.radius) wave.x = w + wave.radius
        if (wave.x > w + wave.radius) wave.x = -wave.radius
        if (wave.y < -wave.radius) wave.y = h + wave.radius
        if (wave.y > h + wave.radius) wave.y = -wave.radius

        const gradient = ctx!.createRadialGradient(
          wave.x, wave.y, 0,
          wave.x, wave.y, wave.radius
        )
        const alpha = wave.opacity * (1 + pulse * 0.5)
        gradient.addColorStop(0, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${alpha})`)
        gradient.addColorStop(0.6, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${alpha * 0.4})`)
        gradient.addColorStop(1, 'transparent')

        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx!.fill()
      })

      // Draw floating particles
      particles.forEach((p) => {
        p.flickerPhase += p.flickerSpeed
        const flicker = 0.5 + 0.5 * Math.sin(p.flickerPhase)
        const alpha = p.opacity * flicker

        // Mouse proximity glow
        let sizeBoost = 0
        if (hasMouse) {
          const pdx = mx - p.x
          const pdy = my - p.y
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy)
          sizeBoost = Math.max(0, 1 - pDist / 200) * 2
        }

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size + sizeBoost, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(212, 175, 55, ${alpha})`
        ctx!.fill()

        p.x += p.dx
        p.y += p.dy

        // Wrap particles
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else {
        draw()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [prefersReduced])

  if (prefersReduced) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
