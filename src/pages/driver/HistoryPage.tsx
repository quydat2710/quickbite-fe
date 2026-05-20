import { useState, useEffect } from 'react'
import { MapPin, Clock, Package, Loader2 } from 'lucide-react'
import { driverApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'

export default function DriverHistoryPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    driverApi.getHistory(1, 50)
      .then(res => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Package style={{ width: '48px', height: '48px', color: '#CBD5E1', margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Chưa có lịch sử giao hàng</p>
        <p style={{ fontSize: '13px', color: '#64748B' }}>Bắt đầu nhận đơn để tích lũy lịch sử!</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>Lịch sử giao hàng</h2>
      {orders.map((order: any) => (
        <div key={order.id} style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{order.restaurantName}</p>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '11px', height: '11px' }} />
                {new Date(order.deliveredAt || order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#10B981', margin: 0 }}>+{formatPrice(order.deliveryFee)}</p>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>{formatPrice(order.total)} tổng</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin style={{ width: '12px', height: '12px', color: '#94A3B8' }} />
            <span style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.deliveryAddress}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
