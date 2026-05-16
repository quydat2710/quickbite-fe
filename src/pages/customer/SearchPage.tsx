import { Input } from '@/components/ui/Input'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { mockRestaurants } from '@/data/mock'
import { useState } from 'react'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const filters = ['Gần nhất', 'Rating cao', 'Giao nhanh', 'Giá thấp', 'Đang mở']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filtered = mockRestaurants.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page-enter bg-bg-white min-h-screen">
      {/* Search header */}
      <div className="sticky top-0 md:top-14 z-30 bg-bg-white border-b border-divider">
        <div className="container py-3 md:py-4">
          <h1 className="text-lg md:text-xl mb-3">Tìm kiếm</h1>

          <div className="relative">
            <Input
              isSearch
              placeholder="Nhà hàng, món ăn yêu thích..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-active transition-colors"
              >
                <X className="h-3.5 w-3.5 text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 mt-2.5 overflow-x-auto scrollbar-hide pb-0.5">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-[12px] font-medium text-text-secondary hover:bg-surface-active transition-colors shrink-0">
              <SlidersHorizontal className="h-3 w-3" />
              Bộ lọc
            </button>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() =>
                  setActiveFilter(activeFilter === f ? null : f)
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  activeFilter === f
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'bg-surface-active text-text-secondary hover:bg-surface-hover'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-4 md:py-5">
        {query && (
          <p className="text-[13px] text-text-tertiary mb-3">
            {filtered.length} kết quả cho "{query}"
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} {...r} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="h-14 w-14 bg-surface-active rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search className="h-7 w-7 text-text-disabled" />
            </div>
            <h3 className="text-text-secondary mb-1">
              Không tìm thấy kết quả
            </h3>
            <p className="text-[13px] text-text-tertiary">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
