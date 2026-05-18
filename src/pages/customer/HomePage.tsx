import { useState } from 'react'
import type { CategoryId } from '@/data/mock'
import {
  MobileHomeHeader,
  HeroBanner,
  CategoryGrid,
  FeaturedBrands,
  NearbyRestaurants,
} from '@/components/home'

/**
 * Customer-facing home page.
 * Composed of modular sub-components for maintainability.
 * Search state is managed globally via SearchProvider — no local search state needed.
 */
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)

  return (
    <div className="page-enter bg-gray-50 min-h-screen flex flex-col gap-2 md:gap-4">
      {/* Mobile-only header with logo, address, search */}
      <MobileHomeHeader />

      {/* Hero banner with slider, typewriter search, popular tags */}
      <HeroBanner />

      {/* Food categories grid with expand/collapse */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Featured brands carousel */}
      <FeaturedBrands />

      {/* Nearby restaurants listing */}
      <NearbyRestaurants selectedCategory={selectedCategory} />
    </div>
  )
}
