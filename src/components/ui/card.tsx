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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setShowGlow(true)
  }

  const handleMouseLeave = () => {
    setShowGlow(false)
  }

  const classes = cn(
    'relative overflow-hidden rounded-lg p-6 transition-all duration-300',
    'bg-white border border-border shadow-sm',
    'dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/[0.06]',
    'hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5',
    className
  )

  const glowOverlay = showGlow && (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(300px circle at ${glowPos.x}px ${glowPos.y}px, rgba(212,175,55,0.08), transparent 60%)`,
      }}
    />
  )

  if (href) {
    return (
      <a
        ref={cardRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(classes, 'block')}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
    >
      {glowOverlay}
      {children}
    </div>
  )
}