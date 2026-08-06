'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { allNavItems } from '@/config/navigation'
import { getResearchEntries, getNoteEntries, getProfessionalContact } from '@/data/content'
import { useTheme } from '@/hooks/use-theme'
import { withBasePath } from '@/lib/base-path'
import { cn } from '@/utils/cn'

interface Command {
  id: string
  label: string
  hint: string
  run: () => void
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toggleTheme } = useTheme()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const goTo = useCallback(
    (href: string) => {
      if (href.startsWith('#')) {
        if (pathname === '/') {
          document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
        } else {
          router.push(`/${href}`)
        }
      } else {
        router.push(href)
      }
      close()
    },
    [pathname, router, close]
  )

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = allNavItems.map((item) => ({
      id: `nav:${item.href}`,
      label: item.label,
      hint: item.href.startsWith('#') ? 'Section' : 'Page',
      run: () => goTo(item.href),
    }))
    const research: Command[] = getResearchEntries().map((entry) => ({
      id: `research:${entry.slug}`,
      label: entry.title,
      hint: 'Research',
      run: () => goTo(`/research/${entry.slug}`),
    }))
    const notes: Command[] = getNoteEntries().map((note) => ({
      id: `note:${note.slug}`,
      label: note.title,
      hint: 'Note',
      run: () => goTo(`/notes/${note.slug}`),
    }))
    const actions: Command[] = [
      { id: 'action:theme', label: 'Toggle dark mode', hint: 'Action', run: () => { toggleTheme(); close() } },
      { id: 'action:cv', label: 'Download CV', hint: 'Action', run: () => { window.open(withBasePath('/files/cv/dzaki-cv.pdf'), '_blank'); close() } },
      { id: 'action:email', label: 'Copy email address', hint: 'Action', run: () => { navigator.clipboard?.writeText(getProfessionalContact().email).catch(() => {}); close() } },
    ]
    return [...nav, ...research, ...notes, ...actions]
  }, [goTo, toggleTheme, close])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    function onOpenEvent() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-command-palette', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-command-palette', onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/30 pt-[18vh] px-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { e.preventDefault(); close() }
            if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
            if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); filtered[selected].run() }
          }}
          placeholder="Type a command or search…"
          aria-label="Search commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-listbox"
          aria-activedescendant={filtered[selected]?.id}
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-[15px] text-foreground placeholder:text-subtle/60 focus:outline-none"
        />
        <ul id="palette-listbox" role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-subtle">No matching commands</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              id={cmd.id}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={cmd.run}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm',
                i === selected ? 'bg-accent/10 text-foreground' : 'text-muted'
              )}
            >
              <span className="truncate">{cmd.label}</span>
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-subtle">{cmd.hint}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-subtle">
          ↑↓ navigate · Enter select · Esc close
        </div>
      </div>
    </div>
  )
}
