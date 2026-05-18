import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBasket, ClipboardList, User, Bell, MapPin, ChevronDown, Heart, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useCartStore } from '@/stores'
import { useSearch } from '@/providers/SearchProvider'

const desktopNavItems = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
  { to: '/favorites', icon: Heart, label: 'Yêu thích' },
]

interface CustomerHeaderProps {
  isScrolled: boolean
}

export function CustomerHeader({ isScrolled }: CustomerHeaderProps) {
  const itemCount = useCartStore((s) => s.getItemCount())
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { openSearch } = useSearch()
  
  // Sliding hover state
  const [hoverStyle, setHoverStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 })

  return (
    <header
      className={cn(
        'hidden md:block sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg border-b border-black/[0.04] shadow-sm'
          : 'bg-white border-b border-black/[0.04]'
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 grid grid-cols-[1fr_auto_1fr] items-center h-[68px]">
        {/* ── Left: Logo + Address ── */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
            <img
              src="/logo_quickbite.png"
              alt="QuickBite"
              className="h-8 w-8 object-contain"
            />
            <span className="font-headline text-[22px] font-extrabold tracking-tight leading-none">
              <span className="text-primary">Quick</span>
              <span className="text-brand-accent">Bite</span>
            </span>
          </NavLink>

          <button className="hidden md:flex items-center gap-1.5 text-[13px] text-text-secondary font-medium hover:text-text-primary transition-colors">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>227 Nguyễn Văn Cừ, Q.5</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
          </button>
        </div>

        {/* ── Center: Nav Links ── */}
        <nav 
          className="flex items-center gap-1 lg:gap-2 relative"
          onMouseLeave={() => setHoverStyle((prev) => ({ ...prev, opacity: 0 }))}
        >
          {/* Sliding Hover Pill */}
          <div
            className="absolute bg-black/[0.08] rounded-full transition-all duration-300 ease-out pointer-events-none z-0"
            style={{
              left: hoverStyle.left,
              top: hoverStyle.top,
              width: hoverStyle.width,
              height: hoverStyle.height,
              opacity: hoverStyle.opacity,
            }}
          />

          {desktopNavItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onMouseEnter={(e) => {
                setHoverStyle({
                  left: e.currentTarget.offsetLeft,
                  top: e.currentTarget.offsetTop,
                  width: e.currentTarget.offsetWidth,
                  height: e.currentTarget.offsetHeight,
                  opacity: 1,
                })
              }}
              className={({ isActive }) =>
                cn(
                  'relative px-6 h-[42px] text-[14.5px] font-medium transition-colors duration-300 rounded-full flex items-center justify-center min-w-[110px] z-10',
                  isActive
                    ? '!text-primary bg-primary/15 font-bold border border-primary/30 shadow-sm'
                    : 'text-text-secondary border border-transparent hover:text-text-primary'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2 justify-end">
          {/* Global Search Trigger */}
          <button
            onClick={() => openSearch()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-active transition-colors group"
            aria-label="Tìm kiếm"
          >
            <Search className="h-5 w-5 text-text-secondary group-hover:text-text-primary" strokeWidth={1.8} />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-active transition-colors group"
              >
                <Bell className="h-5 w-5 text-text-secondary group-hover:text-text-primary" strokeWidth={1.8} />
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-1 ring-white" />
              </button>

              {/* Cart */}
              <NavLink
                to="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-active transition-colors"
              >
                <ShoppingBasket className="h-5 w-5 text-text-secondary" strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </NavLink>

              {/* Avatar / User Pill */}
              <NavLink
                to="/profile"
                className="ml-2 flex items-center gap-2 p-1 pr-3.5 rounded-full border border-border/80 bg-white hover:bg-surface-active hover:shadow-sm hover:border-border transition-all duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-[13px] font-semibold text-text-primary max-w-[100px] truncate">
                  {user?.fullName || 'Người dùng'}
                </span>
              </NavLink>
            </>
          ) : (
            <>
              {/* Cart (guest) */}
              <NavLink
                to="/cart"
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-active transition-colors mr-1"
              >
                <ShoppingBasket className="h-5 w-5 text-text-secondary" strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full ring-2 ring-white">
                    {itemCount}
                  </span>
                )}
              </NavLink>

              {/* Đăng nhập — solid pill with icon */}
              <Link
                to="/login"
                className="h-[44px] px-6 ml-2 rounded-full bg-primary hover:bg-primary-hover !text-white text-[14.5px] font-bold flex items-center gap-2 transition-all duration-200 shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <User className="h-4 w-4 !text-white" strokeWidth={2.5} />
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
