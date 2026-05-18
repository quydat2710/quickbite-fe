import { MapPin, ArrowRight } from 'lucide-react'
import { mockFeaturedBrands } from '@/data/mock'

/**
 * Horizontally scrollable carousel of featured brand cards.
 */
export function FeaturedBrands() {
  return (
    <section className="bg-bg-white pt-6 pb-6 md:pt-10 md:pb-8">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h2 className="text-lg md:text-xl font-bold">Thương hiệu nổi bật</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {mockFeaturedBrands.map((brand) => (
            <button
              key={brand.id}
              className="brand-card flex-shrink-0 w-[120px] md:w-[140px] flex flex-col items-center p-4 rounded-2xl bg-white border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              {/* Logo */}
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden bg-surface-active flex items-center justify-center mb-2.5 ring-1 ring-black/5 group-hover:ring-primary/20 transition-all p-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[13px] font-semibold text-text-primary text-center leading-tight mb-1.5 line-clamp-1">
                {brand.name}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold mb-1">
                {brand.promoTag}
              </span>
              <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {brand.distance}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
