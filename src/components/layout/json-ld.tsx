import { getProfile, getSiteConfig, getContact } from '@/data/content'

export function JsonLd() {
  const profile = getProfile()
  const site = getSiteConfig()
  const contact = getContact()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    url: site.url,
    image: `${site.url}${profile.avatar}`,
    sameAs: [contact.linkedin, contact.github, contact.instagram].filter(Boolean),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
