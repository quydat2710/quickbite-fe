import { useState, useEffect } from 'react'
import {
  MapPin, Phone, Navigation, Package, ChevronRight,
  Clock, X, Check, Store, User, AlertCircle, Loader2,
} from 'lucide-react'
import { driverApi, type DriverEarnings } from '@/services/api/driver.api'
import { formatPrice } from '@/lib/utils'

type DeliveryStatus = 'READY' | 'PICKED_UP' | 'DELIVERED'

interface DriverOrder {
  id: string
  status: string
  restaurantName: string
  deliveryAddress: string
  customerName: string
  customerPhone?: string
  total: number
  deliveryFee: number
  paymentMethod: string
  items: { name: string; quantity: number }[]
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  READY: { label: 'Chờ lấy hàng', color: '#8B5CF6', bg: '#F5F3FF' },
  PICKED_UP: { label: 'Đang giao', color: '#3B82F6', bg: '#EFF6FF' },
  DELIVERED: { label: 'Đã giao', color: '#10B981', bg: '#ECFDF5' },
}

/* ═══ Active Delivery Card ═══ */
function ActiveDeliveryCard({ delivery, onAction }: {
  delivery: DriverOrder; onAction: (action: 'pickup' | 'deliver') => void
}) {
  const st = STATUS_MAP[delivery.status] || { label: delivery.status, color: '#64748B', bg: '#F8FAFC' }

  return (
    <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #DC262622' }}>
      <div style={{ background: st.bg, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: st.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{st.label}</span>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>{delivery.id?.slice(0, 8)?.toUpperCase()}</p>
        </div>
        <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{formatPrice(delivery.deliveryFee)}</span>
      </div>

      <div style={{ height: '100px', background: 'linear-gradient(135deg, #E0F2FE, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navigation style={{ width: '36px', height: '36px', color: '#3B82F6', opacity: 0.4 }} />
      </div>

      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store style={{ width: '12px', height: '12px', color: '#DC2626' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{delivery.restaurantName}</p>
        </div>

        <div style={{ borderLeft: '2px dashed #E2E8F0', height: '10px', marginLeft: '11px' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MapPin style={{ width: '12px', height: '12px', color: '#3B82F6' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{delivery.customerName || 'Khách hàng'}</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{delivery.deliveryAddress}</p>
          </div>
        </div>

        <div style={{ marginTop: '14px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package style={{ width: '14px', height: '14px', color: '#64748B' }} />
          <span style={{ fontSize: '13px', color: '#475569', flex: 1 }}>
            {delivery.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{formatPrice(delivery.total)}</span>
        </div>

        {delivery.paymentMethod === 'COD' && (
          <div style={{ marginTop: '8px', padding: '8px 12px', background: '#FFFBEB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#B45309' }}>
            <AlertCircle style={{ width: '14px', height: '14px' }} /> Thu tiền mặt: {formatPrice(delivery.total)}
          </div>
        )}
      </div>

      <div style={{ padding: '0 18px 18px' }}>
        {delivery.status === 'READY' && (
          <button onClick={() => onAction('pickup')} style={{
            width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', fontSize: '16px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <ChevronRight style={{ width: '20px', height: '20px' }} /> Đã lấy hàng
          </button>
        )}
        {delivery.status === 'PICKED_UP' && (
          <button onClick={() => onAction('deliver')} style={{
            width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <ChevronRight style={{ width: '20px', height: '20px' }} /> Đã giao hàng thành công
          </button>
        )}
      </div>
    </div>
  )
}

/* ═══ Available Order Card ═══ */
function AvailableOrderCard({ order, onAccept }: { order: DriverOrder; onAccept: (id: string) => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{order.restaurantName}</p>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>{order.items.length} món • {order.paymentMethod}</p>
        </div>
        <span style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>{formatPrice(order.deliveryFee)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <MapPin style={{ width: '12px', height: '12px', color: '#64748B' }} />
        <span style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.deliveryAddress}</span>
      </div>
      <button onClick={() => onAccept(order.id)} style={{
        width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
        background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', fontSize: '14px', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
      }}>
        <Check style={{ width: '16px', height: '16px', display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Nhận đơn
      </button>
    </div>
  )
}

/* ═══ Main Page ═══ */
export default function DriverHomePage() {
  const [activeDeliveries, setActiveDeliveries] = useState<DriverOrder[]>([])
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>([])
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mapOrder = (o: any): DriverOrder => ({
    id: o.id,
    status: o.status,
    restaurantName: o.restaurantName || 'Nhà hàng',
    deliveryAddress: o.deliveryAddress || '',
    customerName: o.customerName || 'Khách',
    customerPhone: o.customerPhone,
    total: o.total || 0,
    deliveryFee: o.deliveryFee || 0,
    paymentMethod: o.paymentMethod || 'COD',
    items: (o.items || []).map((i: any) => ({ name: i.name, quantity: i.quantity })),
    createdAt: o.createdAt,
  })

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [deliveries, available, earn] = await Promise.all([
        driverApi.getMyDeliveries(),
        driverApi.getAvailableOrders(1, 10),
        driverApi.getEarnings(),
      ])
      setActiveDeliveries((deliveries || []).map(mapOrder))
      setAvailableOrders((available.data || []).map(mapOrder))
      setEarnings(earn)
    } catch (err) {
      console.error('Failed to load driver data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleAccept = async (orderId: string) => {
    try {
      await driverApi.acceptOrder(orderId)
      await loadData()
    } catch (err) {
      console.error('Failed to accept:', err)
    }
  }

  const handleAction = async (action: 'pickup' | 'deliver', orderId: string) => {
    try {
      if (action === 'pickup') await driverApi.pickupOrder(orderId)
      else await driverApi.deliverOrder(orderId)
      await loadData()
    } catch (err) {
      console.error('Failed to update:', err)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: 'Thu nhập hôm nay', value: formatPrice(earnings?.todayEarnings || 0), color: '#DC2626' },
          { label: 'Chuyến hôm nay', value: `${earnings?.todayDeliveries || 0} chuyến`, color: '#3B82F6' },
          { label: 'Tổng thu nhập', value: formatPrice(earnings?.totalEarnings || 0), color: '#F59E0B' },
          { label: 'Tổng chuyến', value: `${earnings?.totalDeliveries || 0}`, color: '#10B981' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '20px', fontWeight: 800, color: s.color, margin: '0 0 4px 0' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: 0, fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active deliveries */}
      {activeDeliveries.length > 0 ? (
        activeDeliveries.map(d => (
          <ActiveDeliveryCard key={d.id} delivery={d} onAction={(action) => handleAction(action, d.id)} />
        ))
      ) : (
        <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <Navigation style={{ width: '48px', height: '48px', color: '#CBD5E1', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Sẵn sàng nhận đơn!</p>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Đơn hàng mới sẽ hiện lên bên dưới</p>
        </div>
      )}

      {/* Available orders */}
      {availableOrders.length > 0 && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
            Đơn hàng cần giao ({availableOrders.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {availableOrders.map(o => (
              <AvailableOrderCard key={o.id} order={o} onAccept={handleAccept} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
