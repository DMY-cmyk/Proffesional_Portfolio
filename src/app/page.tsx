import { getProfile } from '@/data/content'

export default function Home() {
  const profile = getProfile()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gold-500">{profile.name}</h1>
      <p className="mt-2 text-muted-foreground">{profile.title}</p>
    </main>
  )
}