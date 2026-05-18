import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { mockRestaurants, mockCategories } from '@/data/mock'
import type { CategoryId } from '@/data/mock'

interface NearbyRestaurantsProps {
  selectedCategory: CategoryId | null
}

const ITEMS_PER_PAGE = 4

/**
 * Restaurant listing grid with category filtering and infinite scroll.
 */
export function NearbyRestaurants({ selectedCategory }: NearbyRestaurantsProps) {
  // Get all matching restaurants
  const allFilteredRestaurants = selectedCategory
    ? mockRestaurants.filter((r) =>
        r.categories.some((c) =>
          c.toLowerCase().includes(
            mockCategories.find((mc) => mc.id === selectedCategory)?.keyword || ''
          )
        )
      )
    : mockRestaurants

  // State for infinite scroll
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE)
  const [isFetching, setIsFetching] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  // Reset items when category changes
  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE)
  }, [selectedCategory])

  // Mock fetch function
  const fetchMoreItems = useCallback(() => {
    if (displayedItems >= allFilteredRestaurants.length || isFetching) return
    
    setIsFetching(true)
    // Simulate network delay
    setTimeout(() => {
      setDisplayedItems((prev) => Math.min(prev + ITEMS_PER_PAGE, allFilteredRestaurants.length))
      setIsFetching(false)
    }, 800)
  }, [displayedItems, allFilteredRestaurants.length, isFetching])

  // Setup Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreItems()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [fetchMoreItems])

  const sectionTitle = selectedCategory
    ? mockCategories.find((c) => c.id === selectedCategory)?.name
    : 'Gần bạn'

  const currentRestaurants = allFilteredRestaurants.slice(0, displayedItems)
  const hasMore = displayedItems < allFilteredRestaurants.length

  return (
    <section className="bg-bg-white pt-6 pb-10 md:pt-10 md:pb-16 min-h-[500px]">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2 className="text-lg md:text-xl font-bold">{sectionTitle}</h2>
            <p className="text-sm text-text-tertiary mt-1">
              {allFilteredRestaurants.length} nhà hàng
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {currentRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>

        {/* Empty state */}
        {allFilteredRestaurants.length === 0 && (
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
        {hasMore && (
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
