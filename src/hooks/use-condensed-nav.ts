'use client'

import { useEffect, useState } from 'react'

const CONDENSE_AT = 88
const EXPAND_AT = 72

export function useCondensedNav(): boolean {
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setCondensed((prev) => {
        if (!prev && window.scrollY > CONDENSE_AT) return true
        if (prev && window.scrollY < EXPAND_AT) return false
        return prev
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return condensed
}
