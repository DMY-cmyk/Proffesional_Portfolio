import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-16 py-8 px-6">
      <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-3 font-mono text-xs text-subtle">
        <span>© {year} Dzaki Muhammad Yusfian</span>
        <div className="flex items-center gap-4">
          <span>Built with Next.js · GitHub Pages</span>
          <Link
            href="/personal"
            className="text-muted hover:text-accent transition-colors"
          >
            personal →
          </Link>
        </div>
      </div>
    </footer>
  )
}
