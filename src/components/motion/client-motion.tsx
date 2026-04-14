'use client'
import dynamic from 'next/dynamic'

const WaveBackground = dynamic(
  () => import('@/components/motion/wave-background').then((m) => ({ default: m.WaveBackground })),
  { ssr: false, loading: () => null }
)
const CustomCursor = dynamic(
  () => import('@/components/motion/custom-cursor').then((m) => ({ default: m.CustomCursor })),
  { ssr: false, loading: () => null }
)

export function ClientMotion() {
  return (
    <>
      <WaveBackground />
      <CustomCursor />
    </>
  )
}
