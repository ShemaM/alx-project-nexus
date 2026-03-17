import type { HTMLAttributes } from 'react'

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  shape?: 'circle' | 'bar' | 'heading'
}

/** Generic skeleton placeholder used across the site for loading states. */
export const Skeleton = ({ className = '', shape, ...rest }: SkeletonProps) => {
  const shapeClass = shape ? `skeleton-${shape}` : ''
  return <div className={`skeleton ${shapeClass} ${className}`.trim()} {...rest} />
}

/** Large hero-shaped skeleton used while the landing hero data loads. */
export const HeroSkeleton = () => (
  <div className="space-y-6 rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-md">
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.5em] text-slate-300">
      <Skeleton className="w-10 h-4" />
      <span className="sr-only">Loading badge</span>
    </div>
    <div className="space-y-4">
      <Skeleton className="skeleton-heading h-12 w-full" />
      <Skeleton className="skeleton-bar w-full" />
      <div className="flex gap-3">
        <Skeleton className="skeleton-bar h-12 w-32" />
        <Skeleton className="skeleton-bar h-12 w-32" />
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="skeleton-bar h-24 w-full" />
      ))}
    </div>
  </div>
)

/** Simple marquee placeholder for the updates section while data is outstanding. */
export const MarqueeSkeleton = () => (
  <div className="bg-slate-900 py-10 text-white">
    <div className="container">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm uppercase tracking-[0.4em] text-slate-400">
        <Skeleton className="skeleton-bar h-4 w-32" />
        <Skeleton className="skeleton-bar h-4 w-24" />
      </div>
      <div className="mt-6 flex gap-4 overflow-hidden">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="skeleton-bar h-52 w-60" />
        ))}
      </div>
    </div>
  </div>
)

/** Skeleton used inside filter sidebars to mimic loading controls. */
export const FilterSkeleton = () => (
  <div className="bg-[#E2E8F0] rounded-2xl p-5 border border-[#CBD5E1]">
    <Skeleton className="skeleton-bar h-12 w-full" />
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="skeleton-bar h-12 w-full" />
      ))}
    </div>
  </div>
)

export default Skeleton
