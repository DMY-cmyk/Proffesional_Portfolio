'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

// Wave configuration: 4 layers back → front
const WAVES = [
  { color: 'rgba(15,20,25,0.22)',   speed: 8,  amp: 22, freq: 0.011, phase: 0,   yOffset: 0.60, width: 1.2 },
  { color: 'rgba(13,79,92,0.35)',   speed: 12, amp: 26, freq: 0.010, phase: 1.1, yOffset: 0.48, width: 1.5 },
  { color: 'rgba(184,148,74,0.60)', speed: 17, amp: 20, freq: 0.013, phase: 2.3, yOffset: 0.68, width: 1.8 },
  { color: 'rgba(13,79,92,0.60)',   speed: 22, amp: 28, freq: 0.009, phase: 0.7, yOffset: 0.38, width: 2.0 },
] as const

// 3 accent ticks bound to waves 3, 2, 1 at x-fractions 0.15, 0.55, 0.80
const TICKS = [
  { waveIdx: 3, color: '#0d4f5c', x0: 0.15 },
  { waveIdx: 2, color: '#b8944a', x0: 0.55 },
  { waveIdx: 1, color: '#0d4f5c', x0: 0.80 },
] as const

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctxOrNull = canvas.getContext('2d')
    if (!ctxOrNull) return

    // Non-null aliases for use inside closures (narrowing does not propagate into closures)
    const cvs: HTMLCanvasElement = canvas
    const ctx: CanvasRenderingContext2D = ctxOrNull

    // Dimensions (logical pixels after dpr transform)
    let w = 0
    let h = 0

    // Mouse position in logical pixels; null when outside
    const mouse = { x: null as number | null, y: null as number | null }

    // rAF handle
    let rafId: number | null = null
    let paused = false

    // Time origin — reset on each mount so t=0 on first frame
    const t0 = performance.now()

    // Pick active layers: mobile uses only 2 lightest/front layers
    function getActiveLayers() {
      return w > 0 && w < 768 ? WAVES.slice(2) : WAVES
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      w = window.innerWidth
      h = window.innerHeight
      cvs.width = w * dpr
      cvs.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function sampleWave(
      wave: (typeof WAVES)[number],
      x: number,
      t: number,
    ): number {
      const drift = (wave.speed * t) / 1000
      const breathe = 1 + 0.25 * Math.sin(t * 0.0001 + wave.phase)
      let y =
        wave.yOffset * h +
        wave.amp * breathe * Math.sin(wave.freq * (x + drift * 20) + wave.phase)

      // Cursor attraction: soft Gaussian bulge within 180px radius
      if (mouse.x !== null && mouse.y !== null) {
        const dx = x - mouse.x
        const dy = wave.yOffset * h - mouse.y
        const r2 = dx * dx + dy * dy
        const radius = 180
        if (r2 < radius * radius) {
          const f = Math.exp(-r2 / (radius * 60))
          const toward = (mouse.y - y) * 0.35
          y += toward * f
        }
      }

      return y
    }

    function drawFrame(t: number) {
      ctx.clearRect(0, 0, w, h)

      const activeLayers = getActiveLayers()

      // Draw waves back-to-front
      for (const wave of activeLayers) {
        ctx.beginPath()
        ctx.strokeStyle = wave.color
        ctx.lineWidth = wave.width
        for (let x = 0; x <= w; x += 6) {
          const y = sampleWave(wave, x, t)
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // Draw accent ticks riding the waves
      for (const tk of TICKS) {
        const wave = WAVES[tk.waveIdx]
        const driftOffset = ((wave.speed * t) / 1000) % w
        const x = ((tk.x0 * w + driftOffset * 0.25) % w + w) % w
        const y = sampleWave(wave, x, t)
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + tk.waveIdx)
        ctx.fillStyle = tk.color
        ctx.globalAlpha = 0.35 + 0.55 * pulse
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    function tick() {
      if (paused) return
      const t = performance.now() - t0
      drawFrame(t)
      rafId = requestAnimationFrame(tick)
    }

    // Mouse tracking on window
    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    function onMouseLeave() {
      mouse.x = null
      mouse.y = null
    }
    function onVisibilityChange() {
      paused = document.hidden
      if (!paused && !reduced) {
        rafId = requestAnimationFrame(tick)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (reduced) {
      // Static single frame at t=0; no rAF loop
      drawFrame(0)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      data-testid="wave-background"
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  )
}
