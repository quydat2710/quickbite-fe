import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Star,
  Settings, LogOut, Menu, X, ChevronDown, Power,
} from 'lucide-react'
import { mockRestaurantInfo } from '@/data/restaurant-dashboard.mock'

const NAV_ITEMS = [
  { to: '/restaurant',         icon: LayoutDashboard,  label: 'Dashboard',     end: true },
  { to: '/restaurant/orders',  icon: ShoppingBag,      label: 'Đơn hàng',      end: false },
  { to: '/restaurant/menu',    icon: UtensilsCrossed,  label: 'Thực đơn',      end: false },
  { to: '/restaurant/reviews', icon: Star,             label: 'Đánh giá',      end: false },
  { to: '/restaurant/settings',icon: Settings,         label: 'Cài đặt',       end: false },
]

export default function RestaurantLayout() {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(mockRestaurantInfo.isOnline)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close sidebar on navigate (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  const SidebarContent = (
    <>
      {/* Logo + Restaurant name */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626', letterSpacing: '-0.02em' }}>QuickBite</span>
        </div>
        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', border: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mockRestaurantInfo.name}
          </p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Quản lý nhà hàng</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 700 : 500,
                color: isActive ? '#DC2626' : '#475569',
                background: isActive ? '#FEF2F2' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Online toggle */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={() => setIsOnline(!isOnline)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '14px', fontWeight: 700, transition: 'all 0.2s',
            background: isOnline ? '#ECFDF5' : '#FEF2F2',
            color: isOnline ? '#059669' : '#DC2626',
          }}
        >
          <Power style={{ width: '18px', height: '18px' }} />
          {isOnline ? 'Đang mở bán' : 'Đã tắt'}
        </button>

        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '13px', fontWeight: 600, color: '#94A3B8', background: 'transparent', marginTop: '8px',
        }}>
          <LogOut style={{ width: '16px', height: '16px' }} />
          Đăng xuất
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      {!isMobile && (
        <aside style={{
          width: '260px', background: '#fff', borderRight: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
        }}>
          {SidebarContent}
        </aside>
      )}

      {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
      {isMobile && sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 49, backdropFilter: 'blur(2px)' }} />
          <aside style={{
            width: '280px', background: '#fff', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
          }}>
            <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}>
              <X style={{ width: '20px', height: '20px' }} />
            </button>
            {SidebarContent}
          </aside>
        </>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : '260px', display: 'flex', flexDirection: 'column' }}>

        {/* ── Topbar ── */}
        <header style={{
          height: '64px', background: '#fff', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px', display: 'flex' }}>
              <Menu style={{ width: '24px', height: '24px' }} />
            </button>
          )}

          {isMobile && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo_quickbite.png" alt="QB" style={{ height: '28px' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mockRestaurantInfo.name}</span>
            </div>
          )}

          {!isMobile && (
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {NAV_ITEMS.find(n => {
                  if (n.end) return location.pathname === n.to
                  return location.pathname.startsWith(n.to)
                })?.label || 'Dashboard'}
              </h2>
            </div>
          )}

          {/* Online badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
            background: isOnline ? '#ECFDF5' : '#FEF2F2',
            color: isOnline ? '#059669' : '#DC2626',
            border: `1px solid ${isOnline ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)'}`,
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#10B981' : '#EF4444' }} />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ flex: 1, padding: isMobile ? '16px 12px' : '24px' }}>
          <Outlet />
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '64px',
          background: '#fff', borderTop: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          zIndex: 30, boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                textDecoration: 'none', fontSize: '11px', fontWeight: isActive ? 700 : 500,
                color: isActive ? '#DC2626' : '#94A3B8', padding: '4px 8px',
              })}
            >
              <Icon style={{ width: '22px', height: '22px' }} />
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
