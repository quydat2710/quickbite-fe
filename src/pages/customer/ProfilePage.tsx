import { useState, useEffect } from 'react'
import {
  User, MapPin, CreditCard, Bell, HelpCircle,
  LogOut, ChevronRight, ChevronDown, ChevronLeft,
  Settings, Shield, Gift, ShoppingBag, Receipt,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { AccountPanel, AddressesPanel, GenericPanel } from './panels'

/* ─── Types ─── */
type ChildItem = { id: string; icon?: React.ElementType; label: string }
type NavItem = { id: string; icon: React.ElementType; label: string; children?: ChildItem[] }

/* ─── Navigation Config ─── */
const NAV: NavItem[] = [
  { id: 'account',       icon: User,        label: 'Cập nhật tài khoản' },
  { id: 'orders',        icon: ShoppingBag, label: 'Thông tin đơn hàng', children: [
    { id: 'addresses', icon: MapPin,    label: 'Cập nhật địa chỉ' },
    { id: 'invoices',  icon: Receipt,   label: 'Hoá đơn của bạn' },
  ]},
  { id: 'payment',       icon: CreditCard,  label: 'Phương thức thanh toán', children: [
    { id: 'momo',  icon: CreditCard, label: 'Ví MoMo' },
    { id: 'vnpay', icon: CreditCard, label: 'VNPay' },
    { id: 'cash',  icon: CreditCard, label: 'Tiền mặt' },
  ]},
  { id: 'promotions',    icon: Gift,        label: 'Voucher & Khuyến mãi' },
  { id: 'notifications', icon: Bell,        label: 'Thông báo' },
  { id: 'security',      icon: Shield,      label: 'Bảo mật' },
  { id: 'settings',      icon: Settings,    label: 'Cài đặt chung' },
  { id: 'help',          icon: HelpCircle,  label: 'Trợ giúp & Hỗ trợ' },
]

const LABELS: Record<string, string> = {
  account: 'Thông tin người dùng', addresses: 'Cập nhật địa chỉ', invoices: 'Hoá đơn của bạn',
  momo: 'Ví MoMo', vnpay: 'VNPay', cash: 'Tiền mặt',
  payment: 'Phương thức thanh toán', promotions: 'Voucher & Khuyến mãi',
  notifications: 'Thông báo', security: 'Bảo mật', settings: 'Cài đặt chung', help: 'Trợ giúp & Hỗ trợ',
  orders: 'Thông tin đơn hàng',
}

/* ─── Main ─── */
export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [activeId, setActiveId]   = useState('account')
  const [expanded, setExpanded]   = useState<string[]>(['orders'])
  const [mobileView, setMobileView] = useState<'nav' | 'content'>('nav')
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggleExpand = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const selectItem = (id: string) => {
    setActiveId(id)
    if (isMobile) setMobileView('content')
  }

  const handleNavClick = (item: NavItem) => {
    if (item.children) {
      toggleExpand(item.id)
      if (!isMobile) selectItem(item.children[0].id)
    } else {
      selectItem(item.id)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  /* ─── Content Router ─── */
  const renderContent = () => {
    switch (activeId) {
      case 'account':   return <AccountPanel />
      case 'addresses': return <AddressesPanel />
      default:          return <GenericPanel title={LABELS[activeId] ?? activeId} />
    }
  }

  const isChildActive = (item: NavItem) => item.children?.some(c => c.id === activeId) ?? false

  /* ─── Sidebar ─── */
  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* User card */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User style={{ width: '22px', height: '22px', color: '#DC2626' }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName || 'Người dùng'}</p>
          <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, margin: 0 }}>{user?.email || user?.phone || ''}</p>
        </div>
      </div>

      {/* Nav list */}
      <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {NAV.map((item, idx) => {
          const Icon = item.icon
          const isExp = expanded.includes(item.id)
          const childActive = isChildActive(item)
          const selfActive = activeId === item.id && !item.children

          return (
            <div key={item.id}>
              <button onClick={() => handleNavClick(item)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
                borderTop: idx > 0 ? '1px solid #F8FAFC' : 'none',
                borderLeft: (selfActive || childActive) ? '3px solid #DC2626' : '3px solid transparent',
              }}>
                <Icon style={{ width: '18px', height: '18px', color: (selfActive || childActive) ? '#DC2626' : '#64748B', flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '14px', fontWeight: (selfActive || childActive) ? 700 : 500, color: (selfActive || childActive) ? '#DC2626' : '#0F172A' }}>
                  {item.label}
                </span>
                {item.children
                  ? <ChevronDown style={{ width: '14px', height: '14px', color: '#94A3B8', transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  : <ChevronRight style={{ width: '14px', height: '14px', color: '#CBD5E1', flexShrink: 0 }} />}
              </button>

              {item.children && isExp && (
                <div style={{ background: '#FAFAFA' }}>
                  {item.children.map(child => {
                    const ChildIcon = child.icon
                    const isActive = activeId === child.id
                    return (
                      <button key={child.id} onClick={() => selectItem(child.id)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 18px 11px 48px', background: isActive ? '#FEF2F2' : 'none',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                        borderLeft: isActive ? '3px solid #DC2626' : '3px solid transparent',
                      }}>
                        {ChildIcon && <ChildIcon style={{ width: '14px', height: '14px', color: isActive ? '#DC2626' : '#64748B' }} />}
                        <span style={{ flex: 1, fontSize: '13px', fontWeight: isActive ? 700 : 400, color: isActive ? '#DC2626' : '#475569' }}>{child.label}</span>
                        <ChevronRight style={{ width: '12px', height: '12px', color: '#CBD5E1' }} />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', borderTop: '1px solid #F1F5F9', color: '#EF4444',
        }}>
          <LogOut style={{ width: '18px', height: '18px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Đăng xuất</span>
        </button>
      </div>
    </div>
  )

  /* ─── Content Panel ─── */
  const ContentPanel = (
    <div style={{ background: '#fff', borderRadius: '16px', padding: isMobile ? '20px 16px' : '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', minHeight: '400px' }}>
      {/* Mobile back button */}
      {isMobile && (
        <button onClick={() => setMobileView('nav')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          color: '#DC2626', fontWeight: 600, fontSize: '14px', padding: '0 0 16px 0', marginBottom: '4px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
          Quay lại
        </button>
      )}
      {renderContent()}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '60px', paddingTop: isMobile ? '16px' : '32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 12px' : '0 20px' }}>

        {/* ─── MOBILE: Show only one panel at a time ─── */}
        {isMobile ? (
          <div>
            {mobileView === 'nav' ? Sidebar : ContentPanel}
          </div>
        ) : (
          /* ─── DESKTOP: Side-by-side ─── */
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ width: '260px', flexShrink: 0 }}>
              {Sidebar}
            </div>
            <div style={{ flex: 1 }}>
              {ContentPanel}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
