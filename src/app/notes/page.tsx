import type { Metadata } from 'next'
import Link from 'next/link'
import { getNoteEntries } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Short, plain-language notes on accounting, tax, and sustainability topics.',
}

export default function NotesPage() {
  const notes = [...getNoteEntries()].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        <h1 className="mt-6 font-display text-3xl md:text-4xl font-medium leading-tight tracking-tight text-foreground">
          Notes
        </h1>
        <p className="mt-2 text-muted text-base">
          Short, plain-language notes on accounting, tax, and sustainability topics.
        </p>

        <div className="mt-12 space-y-4">
          {notes.length === 0 && <p className="text-muted">Notes are coming soon.</p>}
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="block rounded-lg border border-border p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(13,79,92,0.35)]"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-subtle">{formatDate(note.date)}</p>
              <h2 className="mt-2 font-display text-xl font-medium leading-snug text-foreground">{note.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{note.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
