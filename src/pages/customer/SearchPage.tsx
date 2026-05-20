// ── Search Results Page ──
// Uses real restaurant API: /search?q=keyword

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearch } from '@/providers/SearchProvider'
import { restaurantApi } from '@/services/api'

const FILTER_OPTIONS = [
  { key: 'nearest', label: 'Gần nhất' },
  { key: 'rating', label: 'Rating cao' },
  { key: 'fastest', label: 'Giao nhanh' },
  { key: 'cheapest', label: 'Giá thấp' },
  { key: 'open', label: 'Đang mở' },
] as const

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const { openSearch } = useSearch()

  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [editableQuery, setEditableQuery] = useState(queryFromUrl)
  const abortRef = useRef<AbortController | null>(null)

  // ── Fetch results from real API ──
  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }

    // Cancel previous
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    try {
      const data = await restaurantApi.search({
        keyword: q,
        limit: 20,
      })

      if (!controller.signal.aborted) {
        const items = data.data || []
        // Map to RestaurantCard props
        const mapped = items.map((r: any) => ({
          id: r.id,
          name: r.name,
          coverImage: r.coverImage || 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=380&fit=crop',
          rating: r.rating || 0,
          totalOrders: r.reviewCount || 0,
          categories: r.tags || [r.category].filter(Boolean),
          distance: 0,
          deliveryTime: r.deliveryTime || '20-30 phút',
          isOnline: r.isOnline ?? true,
        }))
        setResults(mapped)
        setIsLoading(false)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setResults([])
      setIsLoading(false)
    }
  }, [])

  // React to URL changes
  useEffect(() => {
    setEditableQuery(queryFromUrl)
    fetchResults(queryFromUrl)
  }, [queryFromUrl, fetchResults])

  // ── Handle search submit from inline input ──
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = editableQuery.trim()
    if (trimmed && trimmed !== queryFromUrl) {
      setSearchParams({ q: trimmed })
    }
  }

  // ── Toggle filter ──
  const handleFilterToggle = (key: string) => {
    setActiveFilter((prev) => (prev === key ? null : key))
  }

  // ── EMPTY STATE: no query ──
  if (!queryFromUrl) {
    return (
      <div className="page-enter bg-gray-50 min-h-[calc(100vh-68px)] flex items-center justify-center px-6">
        <div className="text-center w-full max-w-[420px] mx-auto">
          <div className="h-20 w-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Search className="h-10 w-10 text-gray-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Bạn muốn ăn gì hôm nay?
          </h1>
          <p className="text-[14px] text-gray-500 font-medium mb-6 leading-relaxed">
            Tìm kiếm nhà hàng, món ăn yêu thích và khám phá những quán mới gần bạn
          </p>
          <button
            onClick={() => openSearch()}
            className="inline-flex items-center gap-2 h-12 px-8 bg-primary hover:bg-primary-hover text-white text-[14px] font-bold rounded-full transition-all shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Search className="h-4 w-4" />
            Bắt đầu tìm kiếm
          </button>
          <p className="mt-4 text-[12px] text-gray-400 font-medium">
            hoặc nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-semibold">Ctrl+K</kbd> để tìm nhanh
          </p>
        </div>
      </div>
    )
  }

  // ── RESULTS STATE ──
  return (
    <div className="page-enter bg-gray-50 min-h-screen">
      {/* Sticky search header */}
      <div className="sticky top-0 md:top-[68px] z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container py-4 md:py-5">
          {/* Editable search bar */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
            <input
              type="text"
              value={editableQuery}
              onChange={(e) => setEditableQuery(e.target.value)}
              placeholder="Nhà hàng, món ăn yêu thích..."
              className="w-full h-12 pl-12 pr-12 text-[15px] font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
            />
            {editableQuery && (
              <button
                type="button"
                onClick={() => setEditableQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </form>

          {/* Filters */}
          <div className="flex gap-2 mt-3.5 overflow-x-auto scrollbar-hide pb-1">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc
            </button>
            {FILTER_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterToggle(key)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border-2',
                  activeFilter === key
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-5 md:py-6">
        {/* Result count */}
        <p className="text-sm text-gray-400 mb-4 font-medium">
          <span className="font-bold text-gray-700">{results.length}</span> kết quả cho "<span className="font-semibold text-gray-600">{queryFromUrl}</span>"
        </p>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-[180px] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {results.map((r) => (
              <RestaurantCard key={r.id} {...r} />
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-700 text-lg font-bold mb-1.5">
              Không tìm thấy kết quả
            </h3>
            <p className="text-sm text-gray-400 font-medium mb-4">
              Thử tìm kiếm với từ khóa khác
            </p>
            <button
              onClick={() => openSearch()}
              className="inline-flex items-center gap-2 text-[13px] text-primary font-semibold hover:underline"
            >
              <Sparkles className="h-4 w-4" />
              Xem gợi ý tìm kiếm
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
