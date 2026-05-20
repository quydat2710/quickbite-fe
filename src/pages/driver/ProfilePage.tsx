import { useState, useEffect } from 'react'
import { Star, Bike, Phone, MapPin, Shield, LogOut, ChevronRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { driverApi, type DriverEarnings } from '@/services/api/driver.api'
import { formatPrice } from '@/lib/utils'

export default function DriverProfilePage() {
  const { user, logout } = useAuthStore()
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    driverApi.getEarnings()
      .then(setEarnings)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  const menuItems = [
    { icon: Phone, label: 'Số điện thoại', value: user?.phone || 'Chưa cập nhật' },
    { icon: Shield, label: 'Email', value: user?.email || 'Chưa cập nhật' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Avatar + Info */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px',
          background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', fontWeight: 800, color: '#DC2626',
          overflow: 'hidden',
        }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            (user?.fullName || 'D').charAt(0)
          )}
        </div>
        <p style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{user?.fullName || 'Tài xế'}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: '#64748B' }}>{earnings?.totalDeliveries || 0} chuyến đã giao</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'Tổng chuyến', value: String(earnings?.totalDeliveries || 0) },
            { label: 'Hôm nay', value: formatPrice(earnings?.todayEarnings || 0) },
            { label: 'Tổng thu nhập', value: formatPrice(earnings?.totalEarnings || 0) },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: '#F8FAFC', borderRadius: '12px', padding: '12px 8px' }}>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        {menuItems.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', borderBottom: i < menuItems.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <item.icon style={{ width: '18px', height: '18px', color: '#64748B' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{item.label}</p>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>{item.value}</p>
            </div>
            <ChevronRight style={{ width: '16px', height: '16px', color: '#CBD5E1' }} />
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={logout} style={{
        width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #FEE2E2',
        background: '#fff', color: '#EF4444', fontSize: '15px', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <LogOut style={{ width: '18px', height: '18px' }} /> Đăng xuất
      </button>
    </div>
  )
}
