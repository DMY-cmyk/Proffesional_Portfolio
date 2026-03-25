import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { withBasePath } from '@/lib/base-path'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const certifications = getCertifications()
  return certifications.map((cert) => ({ slug: cert.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const certifications = getCertifications()
  const cert = certifications.find((c) => c.slug === slug)
  if (!cert) return {}
  return {
    title: cert.name,
    description: `${cert.name} certification from ${cert.issuer}`,
  }
}

export default async function CertificationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const certifications = getCertifications()
  const cert = certifications.find((c) => c.slug === slug)

  if (!cert) {
    notFound()
  }

  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#certifications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover-gold-accent transition-colors mb-8"
        >
          <span aria-hidden="true">←</span> Back to Certifications
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {cert.name}
        </h1>

        <div className="mt-6 rounded-lg border border-border bg-card/80 backdrop-blur-sm p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Issued by:</span>{' '}
              {cert.issuer}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Date:</span>{' '}
              <span className="text-gold-accent">{formatDate(cert.date)}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button href={cert.documentPath} variant="primary" size="lg" external>
            View Certificate
          </Button>
          <a
            href={withBasePath(cert.documentPath)}
            download
            className="inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-surface hover:border-gold-500/50 px-6 py-3 text-lg font-medium transition-colors"
          >
            Download PDF
          </a>
        </div>

        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <iframe
            src={withBasePath(cert.documentPath)}
            className="w-full h-[70vh] min-h-[400px]"
            title={`${cert.name} certificate document`}
          />
        </div>
      </div>
    </div>
  )
}
