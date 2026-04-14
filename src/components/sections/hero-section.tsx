'use client'

import { motion } from 'framer-motion'
import { getProfile } from '@/data/content'
import { withBasePath } from '@/lib/base-path'
import { StatusRibbon } from '@/components/ui/status-ribbon'
import { Button } from '@/components/ui/button'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
}

export function HeroSection() {
  const profile = getProfile()
  const { headline, positioning, statusLine } = profile

  return (
    <section id="hero" className="relative flex min-h-[90vh] items-center px-6 pt-24 pb-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.span
            variants={fadeUp}
            className="font-mono text-[11px] uppercase tracking-widest text-accent font-medium"
          >
            {profile.name}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-3 font-display text-[clamp(44px,5vw,68px)] font-medium leading-[1.05] tracking-tight"
          >
            {headline ? (
              <>
                {headline.plain} <em className="italic text-highlight font-medium">{headline.emphasis}</em>{headline.suffix}
              </>
            ) : (
              profile.title
            )}
          </motion.h1>

          {positioning && (
            <motion.p
              variants={fadeUp}
              className="mt-3 font-display italic text-xl text-muted leading-snug max-w-xl"
            >
              {positioning}
            </motion.p>
          )}

          {statusLine && (
            <motion.div variants={fadeUp}>
              <StatusRibbon {...statusLine} />
            </motion.div>
          )}

          <motion.p
            variants={fadeUp}
            className="mt-2 text-[17px] text-[color:var(--foreground)] opacity-90 leading-relaxed max-w-xl"
          >
            {profile.bio}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
            <Button href="#research" variant="primary" size="lg">
              Read my research →
            </Button>
            <Button href="/files/cv/dzaki-cv.pdf" variant="secondary" size="lg" external>
              Download CV
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          {profile.avatar && (
            <div className="relative w-[min(360px,100%)] aspect-[4/5] overflow-hidden rounded-md border border-border bg-muted shadow-lg shadow-black/5">
              <img
                src={withBasePath(profile.avatar)}
                alt={profile.name}
                width={360}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
