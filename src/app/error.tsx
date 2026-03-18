'use client'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center relative z-10">
      <h1 className="text-4xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <Button variant="primary" size="lg" onClick={reset}>
          Try Again
        </Button>
        <Button href="/" variant="outline" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
