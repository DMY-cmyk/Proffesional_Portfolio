import type { MetadataRoute } from 'next'
import { getSiteConfig, getResearchEntries, getCertifications } from '@/data/content'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig()
  const baseUrl = site.url

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/personal`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const researchRoutes: MetadataRoute.Sitemap = getResearchEntries().map(
    (entry) => ({
      url: `${baseUrl}/research/${entry.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })
  )

  const certRoutes: MetadataRoute.Sitemap = getCertifications().map(
    (cert) => ({
      url: `${baseUrl}/certifications/${cert.slug}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })
  )

  return [...staticRoutes, ...researchRoutes, ...certRoutes]
}
