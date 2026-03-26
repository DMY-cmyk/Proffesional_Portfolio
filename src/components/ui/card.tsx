'use client'

import { useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  href?: string
}

export function Card({ children, className, href }: CardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })
  const [showGlow, setShowGlow] = useState(false)
  const [touched, setTouched] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setShowGlow(true)
  }

  const handleMouseLeave = () => {
    setShowGlow(false)
  }

  const handleTouchStart = () => setTouched(true)
  const handleTouchEnd = () => setTouched(false)

  const classes = cn(
    'relative overflow-hidden rounded-lg p-6 transition-all duration-300',
    'bg-white border border-border shadow-sm',
    'dark:bg-white/[0.03] dark:backdrop-blur-xl',
    'hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5',
    'active:scale-[0.98]',
    className
  )

  const glowOverlay = (showGlow || touched) && (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: touched
          ? 'rgba(212,175,55,0.06)'
          : `radial-gradient(300px circle at ${glowPos.x}px ${glowPos.y}px, rgba(212,175,55,0.08), transparent 60%)`,
      }}
    />
  )

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  }

  if (href) {
    return (
      <a
        ref={cardRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(classes, 'block')}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...touchHandlers}
      >
        {glowOverlay}
        {children}
      </a>
    )
  }

  return (
    <div
      ref={cardRef}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...touchHandlers}
    >
      {glowOverlay}
      {children}
    </div>
  )
}