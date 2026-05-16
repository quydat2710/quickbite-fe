import { Star, Clock, MapPin } from 'lucide-react'
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
  className,
}: RestaurantCardProps) {
  return (
    <NavLink
      to={`/restaurant/${id}`}
      className={cn(
        'group block bg-surface rounded-xl overflow-hidden transition-all duration-300',
        'shadow-xs hover:shadow-card-hover',
        'border border-black/[0.04] hover:border-black/[0.06]',
        'hover:-translate-y-1',
        !isOnline && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-active">
        <img
          src={coverImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {/* Delivery time badge */}
        <div className="absolute bottom-2.5 left-2.5 glass-dark text-text-inverse px-2.5 py-1 rounded-lg flex items-center gap-1">
          <Clock className="h-3 w-3 opacity-80" />
          <span className="text-[11px] font-semibold tracking-wide">{deliveryTime}</span>
        </div>

        {/* Rating badge — top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm">
          <Star className="h-3 w-3 text-brand-accent fill-brand-accent" />
          <span className="text-[11px] font-bold text-text-primary">{rating.toFixed(1)}</span>
        </div>

        {/* Closed overlay */}
        {!isOnline && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="glass px-4 py-2 rounded-lg text-[13px] font-semibold text-text-primary">
              Đã đóng cửa
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 pt-2.5">
        <h3 className="font-semibold text-text-primary line-clamp-1 text-[14px] group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5 text-text-tertiary">
          <div className="flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            <span className="text-[11px] font-medium">{formatDistance(distance)}</span>
          </div>
          <span className="h-0.5 w-0.5 rounded-full bg-text-disabled" />
          <span className="text-[11px] font-medium">{totalOrders.toLocaleString()}+ đơn</span>
        </div>

        {categories.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-2 py-0.5 bg-surface-active rounded-md text-text-secondary font-medium"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </NavLink>
  )
}
