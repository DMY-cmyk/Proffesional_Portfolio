import type { Metadata } from 'next'
import Link from 'next/link'
import { getProfile, getPersonalContact } from '@/data/content'
import { withBasePath } from '@/lib/base-path'

export const metadata: Metadata = {
  title: 'Personal — Dzaki Muhammad Yusfian',
  description: 'A few corners of the internet where Dzaki shares tax-literacy content and personal updates.',
}

export default function PersonalPage() {
  const profile = getProfile()
  const personal = getPersonalContact()

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-accent transition-colors"
        >
          ← Back to portfolio
        </Link>

        {profile.avatar && (
          <div className="mt-8 w-28 h-28 rounded-full overflow-hidden border border-border">
            <img
              src={withBasePath(profile.avatar)}
              alt={profile.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-6 font-display text-3xl font-medium leading-tight">
          {profile.name}
        </h1>

        {personal?.note && (
          <p className="mt-4 text-[17px] text-[color:var(--foreground)] opacity-90 leading-relaxed">
            {personal.note}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {personal?.instagram && (
            <li>
              <a
                href={personal.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent"
              >
                Instagram →
              </a>
            </li>
          )}
          {personal?.tiktok && (
            <li>
              <a
                href={personal.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent"
              >
                TikTok →
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
