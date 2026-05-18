import { useState } from 'react'
import { Star, Clock, MapPin, Heart } from 'lucide-react'
import { cn, formatDistance } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

interface RestaurantCardProps {
  id: string
  name: string
  coverImage: string
  rating: number
  totalOrders: number
  categories: string[]
  distance: number
  deliveryTime: string
  isOnline?: boolean
  promoTag?: string
  className?: string
}

export function RestaurantCard({
  id,
  name,
  coverImage,
  rating,
  totalOrders,
  categories,
  distance,
  deliveryTime,
  isOnline = true,
  promoTag,
  className,
}: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  return (
    <NavLink
      to={`/restaurant/${id}`}
      className={cn(
        'group h-full flex flex-row md:flex-col bg-white rounded-2xl transition-all duration-300',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_12px_28px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.04)]',
        'border border-black/[0.06] hover:border-black/[0.1]',
        'hover:-translate-y-1.5',
        !isOnline && 'pointer-events-none',
        className
      )}
    >
      {/* ─── Cover Image ─── */}
      <div className="relative w-[120px] md:w-full aspect-square md:aspect-[16/10] shrink-0 overflow-hidden rounded-l-2xl md:rounded-l-none md:rounded-t-2xl bg-gray-100">
        <img
          src={coverImage}
          alt={name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]'
          )}
          loading="lazy"
        />

        {/* Gradient overlay (desktop) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent hidden md:block" />

        {/* ─ Promo badge ─ */}
        {promoTag && isOnline && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-bold shadow-md tracking-wide">
              {promoTag}
            </span>
          </div>
        )}

        {/* ─ Favorite button ─ */}
        <button
          onClick={handleFavorite}
          className={cn(
            'absolute top-3 right-3 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-200',
            'backdrop-blur-sm shadow-sm',
            isFavorite
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-400 hover:scale-110'
          )}
        >
          <Heart
            className={cn(
              'h-4 w-4 md:h-[18px] md:w-[18px] transition-transform',
              isFavorite && 'fill-current'
            )}
          />
        </button>

        {/* ─ Delivery time badge (desktop) ─ */}
        <div className="hidden md:flex absolute bottom-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 opacity-80" />
          <span className="text-[12px] font-semibold">{deliveryTime}</span>
        </div>

        {/* ─ Rating badge (desktop) ─ */}
        <div className="hidden md:flex absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-[5px] rounded-full items-center gap-1 shadow-sm border border-white/20">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[12px] font-extrabold text-gray-800 leading-none mt-[1px]">{rating.toFixed(1)}</span>
        </div>

        {/* ─ Closed overlay ─ */}
        {!isOnline && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[12px] md:text-sm font-bold text-gray-700 shadow-sm border border-gray-100">
              Đã đóng cửa
            </span>
          </div>
        )}
      </div>

      {/* ─── Info Section ─── */}
      <div className="flex-1 flex flex-col px-4 pt-3 pb-4 md:px-5 md:pt-4 md:pb-5 justify-start min-w-0">
        {/* Restaurant name */}
        <h3 className="font-extrabold text-gray-900 text-[15px] md:text-[17px] leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-1 tracking-[-0.01em]">
          {name}
        </h3>

        {/* ── Mobile layout ── */}
        <div className="md:hidden flex flex-col gap-2 mt-2">
          {/* Rating + meta row */}
          <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-700">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span>{deliveryTime}</span>
            </div>
            <span className="text-gray-200">|</span>
            <span>{formatDistance(distance)}</span>
          </div>
          {/* Category chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-block px-2.5 py-[3px] bg-gray-100/80 text-gray-500 text-[11px] font-semibold rounded-full"
              >
                {cat}
              </span>
            ))}
            {promoTag && isOnline && (
              <span className="inline-block px-2.5 py-[3px] bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-full">
                {promoTag}
              </span>
            )}
          </div>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:flex flex-col gap-3 mt-3">
          {/* Meta row */}
          <div className="flex items-center gap-2.5 text-[13px] text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gray-300" />
              <span>{formatDistance(distance)}</span>
            </div>
            <span className="text-gray-200">|</span>
            <span>{totalOrders.toLocaleString()}+ đơn</span>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-block px-3 py-[5px] bg-gray-50 text-gray-500 text-[12px] font-semibold rounded-full border border-gray-100/80"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </NavLink>
  )
}
