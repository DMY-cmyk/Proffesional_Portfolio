import type { Metadata } from 'next'
import { getSiteConfig, getProfile } from '@/data/content'

const site = getSiteConfig()
const profile = getProfile()

export const siteMetadata: Metadata = {
  title: {
    default: site.title,
    template: `%s | ${profile.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: profile.name,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}
