'use client'

import { useState, type FormEvent } from 'react'
import { cn } from '@/utils/cn'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (result.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
        setErrorMessage(result.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Network error. Please try again later.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-highlight/30 bg-highlight/5 p-6 text-center" role="status">
        <p className="text-lg font-medium text-foreground">Message sent! ✓</p>
        <p className="mt-2 text-sm text-muted">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  const inputClasses = cn(
    'w-full rounded-md border border-border bg-surface px-4 py-3 text-foreground',
    'placeholder:text-subtle/60',
    'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40',
    'transition-colors'
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Web3Forms access key — public, safe to expose */}
      <input type="hidden" name="access_key" value="b5470dd5-8c03-49aa-b97a-60b117d0ef6f" />
      <input type="hidden" name="subject" value="New message from portfolio" />
      <input type="hidden" name="from_name" value="Portfolio Contact Form" />
      <input type="checkbox" name="botcheck" className="hidden" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can I help you?"
          className={cn(inputClasses, 'resize-none')}
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-8 py-3 font-medium transition-colors',
          'bg-foreground text-background hover:bg-accent',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
