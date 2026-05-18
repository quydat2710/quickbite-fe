import { NavLink } from 'react-router-dom'
import { ShoppingBasket } from 'lucide-react'
import { useCartStore } from '@/stores'

export function MobileFloatingCart() {
  const itemCount = useCartStore((s) => s.getItemCount())

  if (itemCount === 0) return null

  return (
    <NavLink
      to="/cart"
      className="md:hidden fixed bottom-[72px] left-4 right-4 z-40 bg-gradient-to-r from-primary to-primary-hover text-text-inverse rounded-2xl px-5 py-3.5 shadow-[0_6px_24px_rgba(220,38,38,0.3)] flex items-center justify-between hover:shadow-[0_8px_30px_rgba(220,38,38,0.4)] transition-all active:scale-[0.98] animate-slide-up"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-white/15 rounded-lg flex items-center justify-center">
          <ShoppingBasket className="h-4 w-4" />
        </div>
        <span className="font-semibold text-sm">
          {itemCount} món trong giỏ
        </span>
      </div>
      <span className="text-sm font-semibold bg-white/20 px-4 py-1.5 rounded-lg">
        Xem giỏ
      </span>
    </NavLink>
  )
}
