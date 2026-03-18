import { getProfile } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

export function HeroSection() {
  const profile = getProfile()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-4"
    >
      <div className="text-center">
        <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-2 border-gold-500 bg-muted">
          {profile.avatar && (
            <img
              src={withBasePath(profile.avatar)}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gold-500">
          {profile.title}
        </p>
        <p className="mt-2 text-lg text-muted-foreground max-w-lg mx-auto">
          {profile.tagline}
        </p>
      </div>
    </section>
  )
}