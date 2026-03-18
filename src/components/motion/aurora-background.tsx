'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface AuroraWave {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  color: string
}

function createWaves(width: number, height: number): AuroraWave[] {
  const colors = [
    'rgba(212, 175, 55, 0.06)',
    'rgba(229, 193, 88, 0.04)',
    'rgba(184, 148, 31, 0.05)',
    'rgba(212, 175, 55, 0.03)',
    'rgba(154, 117, 24, 0.04)',
  ]

  return colors.map((color) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 200 + Math.random() * 300,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.2,
    color,
  }))
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReduced) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let waves: AuroraWave[]

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      waves = createWaves(canvas!.width, canvas!.height)
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      waves.forEach((wave) => {
        const gradient = ctx!.createRadialGradient(
          wave.x, wave.y, 0,
          wave.x, wave.y, wave.radius
        )
        gradient.addColorStop(0, wave.color)
        gradient.addColorStop(1, 'transparent')

        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx!.fill()

        wave.x += wave.dx
        wave.y += wave.dy

        if (wave.x < -wave.radius) wave.x = canvas!.width + wave.radius
        if (wave.x > canvas!.width + wave.radius) wave.x = -wave.radius
        if (wave.y < -wave.radius) wave.y = canvas!.height + wave.radius
        if (wave.y > canvas!.height + wave.radius) wave.y = -wave.radius
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

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
