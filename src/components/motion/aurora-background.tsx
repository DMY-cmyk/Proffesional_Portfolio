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
  phaseX: number
  phaseY: number
  pulseSpeed: number
  driftSpeed: number
  driftAmplitude: number
}

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  dx: number
  dy: number
  size: number
  opacity: number
  flickerPhase: number
  flickerSpeed: number
  orbitPhase: number
  orbitSpeed: number
  orbitRadius: number
}

export function throttleHandler<T extends (...args: any[]) => void>(callback: T, intervalMs: number): T {
  let lastTime = -Infinity
  return ((...args: any[]) => {
    const now = performance.now()
    if (now - lastTime < intervalMs) return
    lastTime = now
    callback(...args)
  }) as T
}

const PARTICLE_COUNT = 80
const CONNECTION_DISTANCE = 120
const MOUSE_REPEL_RADIUS = 180
const MOUSE_ATTRACT_WAVE_STRENGTH = 0.015

function createWaves(width: number, height: number): AuroraWave[] {
  const configs = [
    { r: 212, g: 175, b: 55, opacity: 0.28 },
    { r: 229, g: 193, b: 88, opacity: 0.22 },
    { r: 184, g: 148, b: 31, opacity: 0.25 },
    { r: 212, g: 175, b: 55, opacity: 0.18 },
    { r: 154, g: 117, b: 24, opacity: 0.20 },
    { r: 200, g: 160, b: 40, opacity: 0.15 },
    { r: 240, g: 210, b: 100, opacity: 0.12 },
    { r: 180, g: 140, b: 60, opacity: 0.10 },
  ]

  return configs.map(({ r, g, b, opacity }) => {
    const x = Math.random() * width
    const y = Math.random() * height
    return {
      x, y,
      baseX: x,
      baseY: y,
      radius: 300 + Math.random() * 400,
      baseRadius: 300 + Math.random() * 400,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.5,
      r, g, b, opacity,
      phase: Math.random() * Math.PI * 2,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      pulseSpeed: 0.006 + Math.random() * 0.008,
      driftSpeed: 0.002 + Math.random() * 0.003,
      driftAmplitude: 60 + Math.random() * 100,
    }
  })
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const x = Math.random() * width
    const y = Math.random() * height
    return {
      x, y,
      baseX: x,
      baseY: y,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -0.15 - Math.random() * 0.35,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.3 + Math.random() * 0.5,
      flickerPhase: Math.random() * Math.PI * 2,
      flickerSpeed: 0.025 + Math.random() * 0.04,
      orbitPhase: Math.random() * Math.PI * 2,
      orbitSpeed: 0.005 + Math.random() * 0.01,
      orbitRadius: 15 + Math.random() * 30,
    }
  })
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()
  const mouseRef = useRef({ x: -1, y: -1 })
  const scrollRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let waves: AuroraWave[]
    let particles: Particle[]

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      waves = createWaves(canvas!.width, canvas!.height)
      particles = createParticles(canvas!.width, canvas!.height)
      cachedScrollHeight = document.body.scrollHeight
    }

    let cachedScrollHeight = document.body.scrollHeight

    const handleMouseMove = throttleHandler((e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }, 16)

    const handleScroll = throttleHandler(() => {
      cachedScrollHeight = document.body.scrollHeight
      scrollRef.current = window.scrollY
    }, 16)

    function draw() {
      const w = canvas!.width
      const h = canvas!.height
      timeRef.current += 0.016

      const t = timeRef.current
      const scrollY = scrollRef.current
      const maxScroll = Math.max(cachedScrollHeight - window.innerHeight, 1)
      const scrollProgress = scrollY / maxScroll

      ctx!.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const hasMouse = mx >= 0

      // Draw aurora waves with organic sine-drift and pulsing
      waves.forEach((wave) => {
        wave.phase += wave.pulseSpeed
        wave.phaseX += wave.driftSpeed
        wave.phaseY += wave.driftSpeed * 0.7

        const pulse = Math.sin(wave.phase) * 0.3
        wave.radius = wave.baseRadius * (1 + pulse)

        // Organic sine-wave drift
        const driftX = Math.sin(wave.phaseX) * wave.driftAmplitude
        const driftY = Math.cos(wave.phaseY) * wave.driftAmplitude * 0.6

        // Scroll reactivity — shift waves horizontally with scroll
        const scrollShift = Math.sin(scrollProgress * Math.PI * 2) * 150

        // Mouse attraction
        if (hasMouse) {
          const ddx = mx - wave.x
          const ddy = my - wave.y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          const pull = Math.min(0.5, 120 / (dist + 150))
          wave.x += ddx * pull * MOUSE_ATTRACT_WAVE_STRENGTH
          wave.y += ddy * pull * MOUSE_ATTRACT_WAVE_STRENGTH
        }

        wave.x += wave.dx
        wave.y += wave.dy

        const drawX = wave.x + driftX + scrollShift
        const drawY = wave.y + driftY

        // Wrap around
        if (wave.x < -wave.radius) wave.x = w + wave.radius
        if (wave.x > w + wave.radius) wave.x = -wave.radius
        if (wave.y < -wave.radius) wave.y = h + wave.radius
        if (wave.y > h + wave.radius) wave.y = -wave.radius

        const gradient = ctx!.createRadialGradient(
          drawX, drawY, 0,
          drawX, drawY, wave.radius
        )
        const alpha = wave.opacity * (1 + pulse * 0.6)
        gradient.addColorStop(0, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${alpha})`)
        gradient.addColorStop(0.4, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${alpha * 0.5})`)
        gradient.addColorStop(0.7, `rgba(${wave.r}, ${wave.g}, ${wave.b}, ${alpha * 0.15})`)
        gradient.addColorStop(1, 'transparent')

        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(drawX, drawY, wave.radius, 0, Math.PI * 2)
        ctx!.fill()
      })

      // Draw connection lines between nearby particles
      ctx!.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * 0.15
            ctx!.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Draw floating particles with orbit, glow, and mouse repulsion
      particles.forEach((p) => {
        p.flickerPhase += p.flickerSpeed
        p.orbitPhase += p.orbitSpeed
        const flicker = 0.5 + 0.5 * Math.sin(p.flickerPhase)
        const alpha = p.opacity * flicker

        // Orbital micro-motion
        const orbitX = Math.cos(p.orbitPhase) * p.orbitRadius
        const orbitY = Math.sin(p.orbitPhase) * p.orbitRadius * 0.5

        // Mouse repulsion
        let repelX = 0
        let repelY = 0
        let sizeBoost = 0
        if (hasMouse) {
          const pdx = (p.x + orbitX) - mx
          const pdy = (p.y + orbitY) - my
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy)
          if (pDist < MOUSE_REPEL_RADIUS) {
            const force = (1 - pDist / MOUSE_REPEL_RADIUS) * 3
            repelX = (pdx / (pDist || 1)) * force
            repelY = (pdy / (pDist || 1)) * force
            sizeBoost = (1 - pDist / MOUSE_REPEL_RADIUS) * 3
          }
        }

        const drawX = p.x + orbitX + repelX
        const drawY = p.y + orbitY + repelY
        const totalSize = p.size + sizeBoost

        // Glow halo
        if (totalSize > 2) {
          const glowGrad = ctx!.createRadialGradient(
            drawX, drawY, 0, drawX, drawY, totalSize * 4
          )
          glowGrad.addColorStop(0, `rgba(212, 175, 55, ${alpha * 0.3})`)
          glowGrad.addColorStop(1, 'transparent')
          ctx!.fillStyle = glowGrad
          ctx!.beginPath()
          ctx!.arc(drawX, drawY, totalSize * 4, 0, Math.PI * 2)
          ctx!.fill()
        }

        // Core particle
        ctx!.beginPath()
        ctx!.arc(drawX, drawY, totalSize, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(212, 175, 55, ${alpha})`
        ctx!.fill()

        p.x += p.dx
        p.y += p.dy

        // Wrap particles
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w }
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w }
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

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
      window.removeEventListener('scroll', handleScroll)
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
