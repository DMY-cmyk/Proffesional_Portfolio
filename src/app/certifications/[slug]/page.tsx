import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getCertifications } from '@/data/content'
import { formatDate } from '@/utils/format-date'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const certifications = getCertifications()
  return certifications.map((cert) => ({ slug: cert.slug }))
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
        <a
          href="/#certifications"
          className="text-sm text-muted-foreground hover:text-gold-500 transition-colors mb-8 inline-block"
        >
          ← Back to Certifications
        </a>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
          {cert.name}
        </h1>

        <div className="mt-4 space-y-2">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Issued by:</span>{' '}
            {cert.issuer}
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Date:</span>{' '}
            {formatDate(cert.date)}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Button href={cert.documentPath} variant="primary" size="lg" external>
            View Certificate
          </Button>
          <a
            href={cert.documentPath}
            download
            className="inline-flex items-center justify-center rounded-md border border-border text-foreground hover:bg-surface px-6 py-3 text-lg font-medium transition-colors"
          >
            Download PDF
          </a>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="mt-8 border border-border rounded-lg overflow-hidden">
          <iframe
            src={cert.documentPath}
            className="w-full h-[600px]"
            title={`${cert.name} certificate document`}
          />
        </div>
      </div>
    </div>
  )
}
