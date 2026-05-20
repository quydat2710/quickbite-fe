import { useState, useEffect } from 'react'
import {
  Clock, Phone, StickyNote, Check, X, ChefHat, Truck, ShoppingBag, Loader2,
} from 'lucide-react'
import { restaurantOwnerApi } from '@/services/api'
import { formatPrice } from '@/lib/utils'
import api from '@/lib/api'

type OrderStatus = 'ALL' | 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'DELIVERED' | 'CANCELLED' | 'PICKED_UP' | 'PENDING_PAYMENT'

interface DashboardOrder {
  id: string
  status: string
  customerName: string
  customerPhone?: string
  total: number
  paymentMethod: string
  note?: string
  items: { name: string; quantity: number; unitPrice: number; totalPrice: number; options?: string }[]
  createdAt: string
}

const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: 'Chờ TT', color: '#F59E0B', bg: '#FFFBEB' },
  NEW: { label: 'Đơn mới', color: '#3B82F6', bg: '#EFF6FF' },
  CONFIRMED: { label: 'Xác nhận', color: '#3B82F6', bg: '#EFF6FF' },
  PREPARING: { label: 'Đang nấu', color: '#F97316', bg: '#FFF7ED' },
  READY: { label: 'Sẵn sàng', color: '#8B5CF6', bg: '#F5F3FF' },
  PICKED_UP: { label: 'Đang giao', color: '#06B6D4', bg: '#ECFEFF' },
  DELIVERED: { label: 'Hoàn thành', color: '#10B981', bg: '#ECFDF5' },
  COMPLETED: { label: 'Hoàn thành', color: '#10B981', bg: '#ECFDF5' },
  CANCELLED: { label: 'Đã huỷ', color: '#EF4444', bg: '#FEF2F2' },
}

const TABS: { key: OrderStatus | 'ALL'; label: string }[] = [
  { key: 'ALL',       label: 'Tất cả' },
  { key: 'NEW',       label: 'Đơn mới' },
  { key: 'PREPARING', label: 'Đang chuẩn bị' },
  { key: 'READY',     label: 'Sẵn sàng' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã huỷ' },
]

const PAYMENT_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  VNPAY: { label: 'VNPay', color: '#1E40AF', bg: '#EFF6FF' },
  MOMO:  { label: 'MoMo',  color: '#A21CAF', bg: '#FDF4FF' },
  COD:   { label: 'COD',   color: '#78716C', bg: '#F5F5F4' },
}

function OrderCard({ order, onAction }: { order: DashboardOrder; onAction: (id: string, action: string) => void }) {
  const st = ORDER_STATUS_MAP[order.status] || { label: order.status, color: '#64748B', bg: '#F8FAFC' }
  const pay = PAYMENT_LABEL[order.paymentMethod] || { label: order.paymentMethod, color: '#78716C', bg: '#F5F5F4' }
  const time = new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      background: '#fff', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: order.status === 'NEW' ? '2px solid #DC2626' : '1px solid rgba(0,0,0,0.02)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: st.bg, borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{order.id?.slice(0, 8)?.toUpperCase()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
              <Clock style={{ width: '12px', height: '12px' }} /> {time}
            </span>
            <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: pay.color, background: pay.bg }}>{pay.label}</span>
          </div>
        </div>
        <span style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: st.color, background: '#fff', border: `1px solid ${st.color}22` }}>{st.label}</span>
      </div>

      {/* Customer */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Phone style={{ width: '16px', height: '16px', color: '#64748B' }} />
        </div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{order.customerName}</p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{order.customerPhone}</p>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '14px 18px' }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                <span style={{ color: '#DC2626', fontWeight: 800, marginRight: '6px' }}>x{item.quantity}</span>
                {item.name}
              </p>
              {item.options && <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>↳ {item.options}</p>}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569', flexShrink: 0, marginLeft: '12px' }}>{formatPrice(item.totalPrice)}</span>
          </div>
        ))}

        {/* Note */}
        {order.note && (
          <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '8px', background: '#FFFBEB', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <StickyNote style={{ width: '14px', height: '14px', color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#92400E', margin: 0, fontWeight: 500 }}>{order.note}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Tổng: </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{formatPrice(order.total)}</span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {order.status === 'NEW' && (
            <>
              <button onClick={() => onAction(order.id, 'reject')} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
                background: '#fff', color: '#64748B', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <X style={{ width: '16px', height: '16px' }} /> Từ chối
              </button>
              <button onClick={() => onAction(order.id, 'accept')} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
              }}>
                <Check style={{ width: '16px', height: '16px' }} /> Xác nhận
              </button>
            </>
          )}
          {order.status === 'PREPARING' && (
            <button onClick={() => onAction(order.id, 'ready')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            }}>
              <ChefHat style={{ width: '16px', height: '16px' }} /> Sẵn sàng giao
            </button>
          )}
          {order.status === 'READY' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '10px',
              background: '#EFF6FF', color: '#3B82F6',
              fontSize: '13px', fontWeight: 600,
            }}>
              <Truck style={{ width: '16px', height: '16px' }} /> Chờ tài xế lấy hàng...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RestaurantOrdersPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL')
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [restaurantId, setRestaurantId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const restaurants = await restaurantOwnerApi.getMyRestaurants()
        if (restaurants.length > 0) {
          setRestaurantId(restaurants[0].id)
          const res = await restaurantOwnerApi.getOrders(restaurants[0].id, 1, 50)
          setOrders((res.data || []).map((o: any) => ({
            id: o.id,
            status: o.status === 'CONFIRMED' ? 'NEW' : o.status,
            customerName: o.customerName || 'Khách',
            customerPhone: o.customerPhone,
            total: o.total,
            paymentMethod: o.paymentMethod,
            note: o.note,
            items: (o.items || []).map((i: any) => ({
              name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.totalPrice,
            })),
            createdAt: o.createdAt,
          })))
        }
      } catch {}
      finally { setIsLoading(false) }
    }
    load()
  }, [])

  const filtered = activeTab === 'ALL' ? orders : orders.filter(o => o.status === activeTab)

  const counts: Record<string, number> = {}
  for (const o of orders) counts[o.status] = (counts[o.status] || 0) + 1

  const handleAction = async (id: string, action: string) => {
    const statusMap: Record<string, string> = {
      accept: 'PREPARING',
      reject: 'CANCELLED',
      ready: 'READY',
      pickup: 'DELIVERED',
    }
    const newStatus = statusMap[action]
    if (!newStatus) return
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => {
        if (o.id !== id) return o
        return { ...o, status: newStatus }
      }))
    } catch (err) {
      console.error('Failed to update order status:', err)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key
          const count = tab.key === 'ALL' ? orders.length : (counts[tab.key] || 0)
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '13px', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap',
                background: isActive ? '#0F172A' : '#fff', color: isActive ? '#fff' : '#475569',
                boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.2)' : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                  color: isActive ? '#fff' : '#64748B',
                  padding: '1px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Order cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
          <ShoppingBag style={{ width: '44px', height: '44px', margin: '0 auto 14px', opacity: 0.3, display: 'block' }} />
          <p style={{ fontSize: '15px', fontWeight: 500 }}>Không có đơn hàng nào</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onAction={handleAction} />
          ))}
        </div>
      )}
    </div>
  )
}
