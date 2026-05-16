import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  ShoppingBasket,
  ClipboardList,
  User,
  Bell,
  MapPin,
  ChevronDown,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores'

const navItems = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { to: '/search', icon: Search, label: 'Tìm kiếm' },
  { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
  { to: '/profile', icon: User, label: 'Tài khoản' },
]

const desktopNavItems = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { to: '/search', icon: Search, label: 'Tìm kiếm' },
  { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
  { to: '/favorites', icon: Heart, label: 'Yêu thích' },
]

export default function CustomerLayout() {
  const location = useLocation()
  const itemCount = useCartStore((s) => s.getItemCount())
  const navigate = useNavigate()
  const hideBottomNav =
    location.pathname.includes('/checkout') ||
    location.pathname.includes('/tracking') ||
    location.pathname.includes('/cart') ||
    location.pathname.startsWith('/restaurant/')

  return (
    <div className="min-h-screen bg-bg">
      {/* ─── Desktop Top Navbar ─── */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/85 backdrop-blur-xl saturate-[180%] border-b border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo_quickbite.png"
              alt="QuickBite"
              className="h-8 w-8 object-contain"
            />
            <span className="font-headline text-lg font-bold">
              <span className="text-brand-accent">Quick</span>
              <span className="text-primary">Bite</span>
            </span>
          </NavLink>

          {/* Address */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-surface-active hover:bg-surface-hover transition-colors ml-6 max-w-[220px]">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[13px] text-text-secondary truncate">
              227 Nguyễn Văn Cừ, Q.5
            </span>
            <ChevronDown className="h-3 w-3 text-text-tertiary shrink-0" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-0.5 ml-auto mr-4">
            {desktopNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary-light/70'
                      : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'
                  )
                }
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-lg hover:bg-black/[0.03] transition-all duration-200 group">
              <Bell className="h-[18px] w-[18px] text-text-secondary group-hover:text-text-primary transition-colors" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full ring-2 ring-white" />
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-black/[0.03] transition-all duration-200"
            >
              <ShoppingBasket className="h-[18px] w-[18px] text-text-secondary" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-[17px] min-w-[17px] px-1 flex items-center justify-center bg-primary text-text-inverse text-[9px] font-bold rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </NavLink>

            {/* Avatar */}
            <NavLink to="/profile" className="ml-1 h-7 w-7 rounded-full bg-gradient-to-br from-primary via-primary-hover to-brand-accent flex items-center justify-center text-text-inverse text-[11px] font-bold hover:shadow-md hover:scale-105 transition-all duration-200 ring-2 ring-white shadow-sm">
              D
            </NavLink>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="pb-16 md:pb-6">
        <Outlet />
      </main>

      {/* ─── Mobile Floating Cart ─── */}
      {itemCount > 0 && !hideBottomNav && (
        <NavLink
          to="/cart"
          className="md:hidden fixed bottom-[68px] left-3 right-3 z-40 bg-gradient-to-r from-primary to-primary-hover text-text-inverse rounded-xl px-4 py-3 shadow-[0_6px_24px_rgba(220,38,38,0.3)] flex items-center justify-between hover:shadow-[0_8px_30px_rgba(220,38,38,0.4)] transition-all active:scale-[0.98] animate-slide-up"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 bg-white/15 rounded-lg flex items-center justify-center">
              <ShoppingBasket className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-[13px]">
              {itemCount} món trong giỏ
            </span>
          </div>
          <span className="text-[13px] font-semibold bg-white/20 px-3 py-1 rounded-lg">
            Xem giỏ
          </span>
        </NavLink>
      )}

      {/* ─── Mobile Bottom Navigation ─── */}
      {!hideBottomNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-xl saturate-[180%] border-t border-black/[0.06] pb-safe">
          <div className="flex items-center justify-around h-14">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-0 transition-all duration-200',
                    isActive
                      ? 'text-primary'
                      : 'text-text-tertiary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        'p-1 rounded-lg transition-all duration-200',
                        isActive && 'bg-primary-light'
                      )}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={isActive ? 2.5 : 1.8}
                      />
                    </div>
                    <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
