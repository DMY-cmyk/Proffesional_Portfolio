'use client'

import { motion } from 'framer-motion'
import { getProfile } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
}

export function HeroSection() {
  const profile = getProfile()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-4"
    >
      <motion.div
        className="text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={scaleIn}
          className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500 bg-muted shadow-lg shadow-gold-500/20"
        >
          {profile.avatar && (
            <img
              src={withBasePath(profile.avatar)}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold hero-gradient-text"
        >
          {profile.name}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-xl md:text-2xl text-gold-500"
        >
          {profile.title}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-2 text-lg text-muted-foreground max-w-lg mx-auto"
        >
          {profile.tagline}
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="mt-8 flex justify-center gap-2"
        >
          <span className="inline-block h-1 w-8 rounded-full bg-gold-500/40" />
          <span className="inline-block h-1 w-3 rounded-full bg-gold-500/25" />
          <span className="inline-block h-1 w-1.5 rounded-full bg-gold-500/15" />
        </motion.div>
      </motion.div>
    </section>
  )
}