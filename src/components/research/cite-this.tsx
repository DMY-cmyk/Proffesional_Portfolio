'use client'

import { useEffect, useState } from 'react'
import { buildApaCitation, buildBibtex, type CitationInput } from '@/lib/article-utils'

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const [canCopy, setCanCopy] = useState(false)

  useEffect(() => {
    setCanCopy(!!navigator.clipboard)
  }, [])

  if (!canCopy) {
    return <span className="text-xs text-subtle">Select the text to copy</span>
  }

  return (
    <button
      onClick={() => {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
          .catch(() => {})
      }}
      className="rounded-md border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted hover:border-accent hover:text-accent transition-colors"
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}

export function CiteThis({ citation }: { citation: CitationInput }) {
  const apa = buildApaCitation(citation)
  const bibtex = buildBibtex(citation)

  return (
    <aside aria-label="Cite this work" className="mt-12 rounded-lg border border-border bg-surface-alt/60 p-6">
      <h2 className="font-display text-lg font-medium text-foreground">Cite this work</h2>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">APA</p>
          <CopyButton label="Copy APA" text={apa} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{apa}</p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-subtle">BibTeX</p>
          <CopyButton label="Copy BibTeX" text={bibtex} />
        </div>
        <pre className="mt-2 overflow-x-auto rounded-md bg-background p-3 text-xs leading-relaxed text-muted">{bibtex}</pre>
      </div>
    </aside>
  )
}
