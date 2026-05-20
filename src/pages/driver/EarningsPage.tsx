import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Truck, Loader2 } from 'lucide-react'
import { driverApi, type DriverEarnings } from '@/services/api/driver.api'
import { formatPrice } from '@/lib/utils'

export default function DriverEarningsPage() {
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

  const e = earnings || { todayEarnings: 0, todayDeliveries: 0, totalEarnings: 0, totalDeliveries: 0 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Thu nhập</h2>

      {/* Today */}
      <div style={{ background: 'linear-gradient(135deg, #DC2626, #EA580C)', borderRadius: '20px', padding: '24px', color: '#fff', boxShadow: '0 8px 24px rgba(220,38,38,0.25)' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.85, margin: '0 0 8px 0' }}>Thu nhập hôm nay</p>
        <p style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{formatPrice(e.todayEarnings)}</p>
        <p style={{ fontSize: '14px', fontWeight: 600, opacity: 0.8, margin: 0 }}>{e.todayDeliveries} chuyến giao hàng</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <DollarSign style={{ width: '20px', height: '20px', color: '#10B981' }} />
          </div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{formatPrice(e.totalEarnings)}</p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 500 }}>Tổng thu nhập</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Truck style={{ width: '20px', height: '20px', color: '#3B82F6' }} />
          </div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{e.totalDeliveries}</p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 500 }}>Tổng chuyến</p>
        </div>
      </div>

      {/* Avg per delivery */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp style={{ width: '22px', height: '22px', color: '#F59E0B' }} />
        </div>
        <div>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
            {e.totalDeliveries > 0 ? formatPrice(Math.round(e.totalEarnings / e.totalDeliveries)) : '0đ'}
          </p>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: 500 }}>Thu nhập trung bình / chuyến</p>
        </div>
      </div>
    </div>
  )
}
