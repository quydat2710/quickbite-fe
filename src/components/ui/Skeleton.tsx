import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />
}

export function RestaurantCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-surface shadow-sm">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 bg-surface rounded-xl">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
    </div>
  )
}
