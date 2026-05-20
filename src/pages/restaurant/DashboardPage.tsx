import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, ShoppingBag, DollarSign,
  CheckCircle2, Star, ArrowRight, Clock, Loader2,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { restaurantOwnerApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: 'Chờ TT', color: '#F59E0B', bg: '#FFFBEB' },
  CONFIRMED: { label: 'Xác nhận', color: '#3B82F6', bg: '#EFF6FF' },
  PREPARING: { label: 'Đang nấu', color: '#F97316', bg: '#FFF7ED' },
  READY: { label: 'Sẵn sàng', color: '#8B5CF6', bg: '#F5F3FF' },
  PICKED_UP: { label: 'Đang giao', color: '#06B6D4', bg: '#ECFEFF' },
  DELIVERED: { label: 'Hoàn thành', color: '#10B981', bg: '#ECFDF5' },
  CANCELLED: { label: 'Huỷ', color: '#EF4444', bg: '#FEF2F2' },
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, delta, color, bg }: {
  icon: React.ElementType; label: string; value: string; delta?: number; color: string; bg: string
}) {
  const isUp = (delta ?? 0) >= 0
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '20px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)',
      display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px', minWidth: '180px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ width: '22px', height: '22px', color }} />
        </div>
        {delta !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: isUp ? '#10B981' : '#EF4444' }}>
            {isUp ? <TrendingUp style={{ width: '14px', height: '14px' }} /> : <TrendingDown style={{ width: '14px', height: '14px' }} />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{value}</p>
        <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: 500 }}>{label}</p>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function RestaurantDashboardPage() {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const restaurants = await restaurantOwnerApi.getMyRestaurants()
        if (restaurants.length > 0) {
          const rest = restaurants[0]
          setRestaurant(rest)
          // Get recent orders
          const ordersRes = await restaurantOwnerApi.getOrders(rest.id, 1, 5)
          setOrders(ordersRes.data || [])
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>Chưa có nhà hàng</h2>
        <p style={{ color: '#64748B', fontSize: '14px' }}>Bạn chưa đăng ký nhà hàng nào.</p>
      </div>
    )
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Stat Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <StatCard icon={DollarSign} label="Tổng đơn" value={String(restaurant.totalOrders || 0)} color="#DC2626" bg="#FEF2F2" />
        <StatCard icon={ShoppingBag} label="Đánh giá" value={String(restaurant.totalReviews || 0)} color="#3B82F6" bg="#EFF6FF" />
        <StatCard icon={Star} label="Đánh giá TB" value={`${restaurant.rating || 0} ⭐`} color="#F59E0B" bg="#FFFBEB" />
        <StatCard icon={CheckCircle2} label="Trạng thái" value={restaurant.isOnline ? 'Online' : 'Offline'} color={restaurant.isOnline ? '#10B981' : '#EF4444'} bg={restaurant.isOnline ? '#ECFDF5' : '#FEF2F2'} />
      </div>

      {/* Recent orders */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Đơn hàng gần đây</h3>
          <NavLink to="/restaurant/orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#DC2626', textDecoration: 'none' }}>
            Xem tất cả <ArrowRight style={{ width: '14px', height: '14px' }} />
          </NavLink>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>Chưa có đơn hàng nào</p>
        ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                {['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Thời gian'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => {
                const st = ORDER_STATUS_MAP[order.status] || { label: order.status, color: '#64748B', bg: '#F8FAFC' }
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{order.id?.slice(0, 8)?.toUpperCase()}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#475569' }}>{order.customerName || 'Khách'}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}
