import { getProfile, getSiteConfig, getContact } from '@/data/content'

export function JsonLd() {
  const profile = getProfile()
  const site = getSiteConfig()
  const contact = getContact()

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    url: site.url,
    sameAs: [contact.linkedin, contact.github, contact.instagram].filter(Boolean),
  }

  // Only include image if avatar path is set.
  // Note: site.url already includes the basePath (e.g. /Proffesional_Portfolio),
  // and profile.avatar starts with /images/..., so concatenation produces the correct full URL.
  if (profile.avatar && profile.avatar.length > 0) {
    structuredData.image = `${site.url}${profile.avatar}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
