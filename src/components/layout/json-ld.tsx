import { getProfile, getProfessionalContact, getPersonalContact, getSiteConfig } from '@/data/content'

export function JsonLd() {
  const profile = getProfile()
  const site = getSiteConfig()
  const contact = getProfessionalContact()
  const personal = getPersonalContact()

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${contact.email}`,
    url: site.url,
    worksFor: {
      '@type': 'Organization',
      name: 'PT. Kolosal Kecerdasan Artifisial',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'STIE YKPN Business School Yogyakarta',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jakarta',
      addressCountry: 'ID',
    },
    knowsAbout: [
      'Taxation',
      'Auditing',
      'Financial Reporting',
      'Financial Analysis',
      'Sustainability Reporting',
      'Firm Value',
    ],
    sameAs: [contact.linkedin, contact.github, personal?.instagram, personal?.tiktok].filter(Boolean),
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
