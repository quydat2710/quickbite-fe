import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { RestaurantCard } from '@/components/restaurant/RestaurantCard'
import { mockRestaurants } from '@/data/mock'

export default function FavoritesPage() {
  const navigate = useNavigate()
  // Simulate favorites (first 3 restaurants liked)
  const [favorites] = useState(mockRestaurants.slice(0, 3))

  return (
    <div className="page-enter min-h-screen bg-bg">
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors md:hidden">
              <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
            </button>
            <h1 className="text-lg font-bold">Yêu thích</h1>
            <span className="text-[12px] text-text-tertiary ml-1">({favorites.length})</span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center content-narrow">
            <div className="h-16 w-16 bg-primary-light rounded-xl flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-text-primary mb-1.5">Chưa có nhà hàng yêu thích</h3>
            <p className="text-[13px] text-text-tertiary leading-relaxed">
              Nhấn vào biểu tượng ❤️ trên trang nhà hàng để thêm vào danh sách yêu thích
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {favorites.map((r) => (
              <RestaurantCard key={r.id} {...r} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
