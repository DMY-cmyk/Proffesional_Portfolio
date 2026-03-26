import { Skeleton } from '@/components/ui/skeleton'

export default function ResearchDetailLoading() {
  return (
    <div className="py-20 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Title */}
        <Skeleton className="h-9 w-4/5 mt-4" />

        {/* Date */}
        <Skeleton className="h-5 w-32 mt-3" />

        {/* Tags */}
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Content */}
        <div className="mt-10 border-t border-border pt-10 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-4 w-full mt-6" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    </div>
  )
}
