import { Skeleton } from '@/components/ui/skeleton'

export default function CertificationDetailLoading() {
  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Title */}
        <Skeleton className="h-9 w-3/5 mt-4" />

        {/* Info card */}
        <div className="mt-6 rounded-lg border border-border p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <Skeleton className="h-12 w-40 rounded-md" />
          <Skeleton className="h-12 w-40 rounded-md" />
        </div>

        {/* PDF iframe placeholder */}
        <Skeleton className="mt-8 h-[70vh] min-h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
