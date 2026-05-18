import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CustomerHeader } from '@/components/layout/CustomerHeader'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileFloatingCart } from '@/components/layout/MobileFloatingCart'
import { GlobalSearchOverlay } from '@/components/layout/GlobalSearchOverlay'
import { SearchProviderWithPreload } from '@/providers/SearchProvider'

export default function CustomerLayout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hideBottomNav =
    location.pathname.includes('/checkout') ||
    location.pathname.includes('/tracking') ||
    location.pathname.includes('/cart') ||
    location.pathname.startsWith('/restaurant/')

  return (
    <SearchProviderWithPreload>
      <div className="min-h-screen bg-bg">
        {/* ─── Desktop Header ─── */}
        <CustomerHeader isScrolled={isScrolled} />

        {/* ─── Main Content ─── */}
        <main className="pb-16 md:pb-8">
          <Outlet />
        </main>

        {/* ─── Mobile Floating Cart ─── */}
        {!hideBottomNav && <MobileFloatingCart />}

        {/* ─── Mobile Bottom Nav ─── */}
        {!hideBottomNav && <MobileBottomNav />}

        {/* ─── Global Search Overlay (portal-level) ─── */}
        <GlobalSearchOverlay />
      </div>
    </SearchProviderWithPreload>
  )
}
