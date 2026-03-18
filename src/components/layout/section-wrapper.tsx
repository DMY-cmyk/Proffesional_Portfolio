'use client'

import { cn } from '@/utils/cn'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 px-4', className)}>
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          {children}
        </ScrollReveal>
      </div>
    </section>
  )
}