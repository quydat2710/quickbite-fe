import { MapPin, Bell, ChevronDown, Search, Loader2 } from 'lucide-react'
import { useSearch } from '@/providers/SearchProvider'
import { useLocationStore } from '@/stores'

/**
 * Mobile-only header for the Home page.
 * Displays logo, address selector, notification bell, and fake search bar.
 * Search bar opens the global search overlay on tap.
 */
export function MobileHomeHeader() {
  const { openSearch } = useSearch()
  const { displayAddress, isLoading: isLocationLoading, detectCurrentLocation } = useLocationStore()

  return (
    <header className="md:hidden bg-white px-4 pt-4 pb-4 border-b border-black/[0.06] shadow-sm">
      {/* Top Row: Logo + Notification */}
      <div className="flex items-center justify-between mb-3.5">
        {/* Logo + Address */}
        <div className="flex items-center gap-2">
          <img src="/logo_quickbite.png" alt="QuickBite" className="h-7 w-7 object-contain" />
          <div>
            <span className="font-headline text-[18px] font-extrabold tracking-tight leading-none">
              <span className="text-primary">Quick</span>
              <span className="text-brand-accent">Bite</span>
            </span>
            <button onClick={() => detectCurrentLocation()} className="flex items-center gap-0.5 text-[11px] text-text-secondary font-medium mt-0.5 leading-none max-w-[200px]">
              {isLocationLoading ? (
                <Loader2 className="h-3 w-3 text-primary shrink-0 animate-spin" />
              ) : (
                <MapPin className="h-3 w-3 text-primary shrink-0" />
              )}
              <span className="truncate">{displayAddress}</span>
              <ChevronDown className="h-3 w-3 text-text-tertiary shrink-0" />
            </button>
          </div>
        </div>

        {/* Notification */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Bell className="h-[18px] w-[18px] text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full ring-2 ring-white" />
        </button>
      </div>

      {/* Fake Search Bar — opens overlay on tap */}
      <button
        onClick={() => openSearch()}
        className="w-full flex items-center gap-3 bg-gray-100 rounded-full px-4 h-[44px] text-left"
      >
        <Search className="h-4 w-4 text-text-tertiary shrink-0" />
        <span className="flex-1 text-[14px] text-text-tertiary font-medium">
          Tìm nhà hàng, món ăn...
        </span>
      </button>
    </header>
  )
}
