import { Button } from '@/components/ui/button'
import { AuroraBackground } from '@/components/motion/aurora-background'

export default function NotFound() {
  return (
    <>
      <AuroraBackground />
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative z-10">
        <h1 className="text-8xl font-bold text-gold-500">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Page not found
        </p>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </>
  )
}
