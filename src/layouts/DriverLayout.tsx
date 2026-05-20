import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Clock, Wallet, User, Power } from 'lucide-react'
import { mockDriverInfo } from '@/data/driver-dashboard.mock'

const NAV_ITEMS = [
  { to: '/driver',          icon: Home,   label: 'Trang chủ',   end: true },
  { to: '/driver/history',  icon: Clock,  label: 'Lịch sử',     end: false },
  { to: '/driver/earnings', icon: Wallet, label: 'Thu nhập',     end: false },
  { to: '/driver/profile',  icon: User,   label: 'Tài khoản',   end: false },
]

export default function DriverLayout() {
  const location = useLocation()
  const [isOnline, setIsOnline] = useState(mockDriverInfo.isOnline)

  const pageTitle = NAV_ITEMS.find(n => {
    if (n.end) return location.pathname === n.to
    return location.pathname.startsWith(n.to)
  })?.label || 'QuickBite Driver'

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>

      {/* ── Topbar ── */}
      <header style={{
        height: '60px', background: '#fff', borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px',
        position: 'sticky', top: 0, zIndex: 30,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}>
        <img src="/logo_quickbite.png" alt="QB" style={{ height: '28px' }} />
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', flex: 1 }}>{pageTitle}</span>

        {/* Online/Offline badge */}
        <button onClick={() => setIsOnline(!isOnline)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
          fontSize: '12px', fontWeight: 700, fontFamily: 'inherit',
          background: isOnline ? '#ECFDF5' : '#FEF2F2',
          color: isOnline ? '#059669' : '#DC2626',
        }}>
          <Power style={{ width: '14px', height: '14px' }} />
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </header>

      {/* ── Content ── */}
      <main style={{ padding: '16px', paddingBottom: '80px' }}>
        <Outlet />
      </main>

      {/* ── Bottom Nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px', height: '64px',
        background: '#fff', borderTop: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        zIndex: 30, boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
      }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              textDecoration: 'none', fontSize: '11px', fontWeight: isActive ? 700 : 500,
              color: isActive ? '#DC2626' : '#94A3B8', padding: '4px 12px',
            })}>
            <Icon style={{ width: '22px', height: '22px' }} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
