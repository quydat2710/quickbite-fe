import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { restaurantApi } from '@/services/api'
import { mockCategories } from '@/data/categories.mock'
import type { CategoryId } from '@/data/categories.mock'

interface NearbyRestaurantsProps {
  selectedCategory: CategoryId | null
}

const ITEMS_PER_PAGE = 8

/**
 * Restaurant listing grid with category filtering and pagination.
 * Fetches from real API — falls back to empty state gracefully.
 */
export function NearbyRestaurants({ selectedCategory }: NearbyRestaurantsProps) {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Get category keyword for filtering
  const categoryKeyword = selectedCategory
    ? mockCategories.find((c) => c.id === selectedCategory)?.keyword || ''
    : ''

  // Fetch restaurants from API
  const fetchRestaurants = useCallback(async (pageNum: number, reset = false) => {
    if (reset) setIsLoading(true)
    else setIsFetching(true)

    try {
      const result = await restaurantApi.search({
        category: categoryKeyword || undefined,
        page: pageNum,
        limit: ITEMS_PER_PAGE,
      })

      const items = result.data || []

      // Map API response to RestaurantCard props
      const mapped = items.map((r: any) => ({
        id: r.id,
        name: r.name,
        coverImage: r.coverImage || 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=380&fit=crop',
        rating: r.rating || 0,
        totalOrders: r.reviewCount || 0,
        categories: r.tags || [r.category].filter(Boolean),
        distance: 0, // TODO: calculate from lat/lng
        deliveryTime: r.deliveryTime || '20-30 phút',
        isOnline: r.isOnline ?? true,
        promoTag: undefined,
      }))

      if (reset) {
        setRestaurants(mapped)
      } else {
        setRestaurants((prev) => [...prev, ...mapped])
      }

      setHasMore(items.length === ITEMS_PER_PAGE)
    } catch {
      if (reset) setRestaurants([])
      setHasMore(false)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [categoryKeyword])

  // Reset on category change
  useEffect(() => {
    setPage(1)
    fetchRestaurants(1, true)
  }, [fetchRestaurants])

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (isFetching || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchRestaurants(nextPage)
  }, [isFetching, hasMore, page, fetchRestaurants])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 },
    )
    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loadMore])

  const sectionTitle = selectedCategory
    ? mockCategories.find((c) => c.id === selectedCategory)?.name
    : 'Gần bạn'

  return (
    <section className="bg-bg-white pt-6 pb-10 md:pt-10 md:pb-16 min-h-[500px]">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold">{sectionTitle}</h2>
            <p className="text-sm text-text-tertiary mt-1">
              {restaurants.length} nhà hàng
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
        {!isLoading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && restaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="h-16 w-16 bg-surface-active rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-text-disabled" />
            </div>
            <h3 className="text-text-secondary text-lg font-semibold mb-1.5">
              Không tìm thấy nhà hàng
            </h3>
            <p className="text-sm text-text-tertiary">
              Thử chọn danh mục khác hoặc tìm kiếm theo tên
            </p>
          </div>
        )}

        {/* Infinite Scroll Target & Loader */}
        {!isLoading && hasMore && (
          <div ref={observerTarget} className="flex justify-center items-center py-8 mt-4">
            {isFetching && (
              <div className="flex flex-col items-center gap-2 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm font-medium text-text-tertiary">Đang tải thêm...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
