import { NavLink } from 'react-router-dom'
import { Home, Search, ClipboardList, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSearch } from '@/providers/SearchProvider'

const navItems = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { action: 'search' as const, icon: Search, label: 'Tìm kiếm' },
  { to: '/orders', icon: ClipboardList, label: 'Đơn hàng' },
  { to: '/profile', icon: User, label: 'Tài khoản' },
]

export function MobileBottomNav() {
  const { openSearch, isOpen: isSearchOpen } = useSearch()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl saturate-[180%] border-t border-black/[0.06] pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          // Search is a button, not a link
          if ('action' in item && item.action === 'search') {
            const Icon = item.icon
            return (
              <button
                key="search"
                onClick={() => openSearch()}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 min-w-0 transition-all duration-200',
                  isSearchOpen ? 'text-primary' : 'text-text-tertiary'
                )}
              >
                <div
                  className={cn(
                    'p-1.5 rounded-xl transition-all duration-200',
                    isSearchOpen && 'bg-primary-light'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-[22px] w-[22px] transition-all duration-300',
                      isSearchOpen ? 'text-primary scale-110' : 'text-text-tertiary scale-100'
                    )}
                    strokeWidth={isSearchOpen ? 2.5 : 2}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-semibold transition-all duration-300',
                    isSearchOpen ? 'text-primary' : 'text-text-tertiary'
                  )}
                >
                  {item.label}
                </span>
              </button>
            )
          }

          // Regular nav links
          const { to, icon: Icon, label } = item as { to: string; icon: typeof Home; label: string }
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 min-w-0 transition-all duration-200',
                  isActive ? 'text-primary' : 'text-text-tertiary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-1.5 rounded-xl transition-all duration-200',
                      isActive && 'bg-primary-light'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[22px] w-[22px] transition-all duration-300',
                        isActive ? 'text-primary scale-110' : 'text-text-tertiary scale-100'
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-semibold transition-all duration-300',
                      isActive ? 'text-primary' : 'text-text-tertiary'
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
