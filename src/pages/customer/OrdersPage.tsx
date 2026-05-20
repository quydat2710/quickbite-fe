import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  ClipboardList, ArrowRight, ChevronRight, MapPin,
  RotateCcw, Star, Eye, UtensilsCrossed, Clock, Loader2,
} from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { orderApi } from '@/services/api'
import type { Order, OrderStatus } from '@/types/order'

/* ═══════════════════════════════════════════════════════
   STATUS CONFIG — label, badge colors, CTA text & style
   ═══════════════════════════════════════════════════════ */
interface StatusConfig {
  label: string
  badgeBg: string
  badgeText: string
  dotColor: string
  borderColor: string
  ctaLabel: string
  ctaHighlight?: boolean
}

const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  PENDING: { label: 'Chờ xác nhận', badgeBg: '#FFFBEB', badgeText: '#B45309', dotColor: '#F59E0B', borderColor: '#FDE68A', ctaLabel: 'Xem chi tiết' },
  CONFIRMED: { label: 'Đã xác nhận', badgeBg: '#EFF6FF', badgeText: '#1D4ED8', dotColor: '#3B82F6', borderColor: '#BFDBFE', ctaLabel: 'Xem chi tiết' },
  PREPARING: { label: 'Đang chuẩn bị', badgeBg: '#FFF7ED', badgeText: '#C2410C', dotColor: '#F97316', borderColor: '#FED7AA', ctaLabel: 'Theo dõi đơn' },
  READY: { label: 'Sẵn sàng giao', badgeBg: '#ECFEFF', badgeText: '#0E7490', dotColor: '#06B6D4', borderColor: '#A5F3FC', ctaLabel: 'Theo dõi đơn' },
  DELIVERING: { label: 'Đang giao', badgeBg: '#ECFDF5', badgeText: '#047857', dotColor: '#10B981', borderColor: '#A7F3D0', ctaLabel: 'Xem bản đồ Live', ctaHighlight: true },
  DELIVERED: { label: 'Đã giao', badgeBg: '#ECFDF5', badgeText: '#047857', dotColor: '#10B981', borderColor: '#A7F3D0', ctaLabel: 'Đặt lại' },
  CANCELLED: { label: 'Đã huỷ', badgeBg: '#FEF2F2', badgeText: '#DC2626', dotColor: '#EF4444', borderColor: '#FECACA', ctaLabel: 'Đặt lại' },
}

/* ═══════════════════════════════════════════════════════
   FILTER TABS
   ═══════════════════════════════════════════════════════ */
type FilterTab = 'PROCESSING' | 'HISTORY' | 'REVIEWS' | 'DRAFT'

const PROCESSING_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING']

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'PROCESSING', label: 'Đang xử lý' },
  { id: 'HISTORY', label: 'Lịch sử mua' },
  { id: 'REVIEWS', label: 'Đánh giá' },
  { id: 'DRAFT', label: 'Đơn nháp' },
]

/* Helper: map API order to local Order type */
function mapApiOrder(o: any): Order {
  return {
    id: o.id,
    orderCode: o.id?.slice(0, 8)?.toUpperCase() || o.id,
    restaurantId: o.restaurantId,
    restaurantName: o.restaurantName || 'Nhà hàng',
    restaurantImage: undefined,
    status: o.status as OrderStatus,
    items: (o.items || []).map((i: any) => ({
      menuItemId: i.menuItemId,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      options: (i.options || []).map((opt: any) => typeof opt === 'string' ? opt : opt.optionName || ''),
    })),
    subtotal: o.subtotal || 0,
    deliveryFee: o.deliveryFee || 0,
    total: o.total || 0,
    createdAt: o.createdAt,
    estimatedDelivery: o.updatedAt || o.createdAt,
  }
}

/* ═══════════════════════════════════════════════════════
   HELPER: format date/time
   ═══════════════════════════════════════════════════════ */
function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ═══════════════════════════════════════════════════════
   IMAGE FALLBACK COMPONENT
   ═══════════════════════════════════════════════════════ */
function RestaurantImage({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div style={{
        width: 72, height: 72, borderRadius: 16,
        background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, border: '1px solid rgba(220,38,38,0.08)',
      }}>
        <UtensilsCrossed style={{ width: 28, height: 28, color: 'rgba(220,38,38,0.3)' }} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      style={{
        width: 72, height: 72, borderRadius: 16,
        objectFit: 'cover', flexShrink: 0,
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════════════════ */
function OrderCardSkeleton() {
  return (
    <div className="animate-pulse" style={{
      background: '#fff', borderRadius: 16, padding: 20,
      border: '1px solid rgba(0,0,0,0.03)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      display: 'flex', gap: 16, alignItems: 'center',
    }}>
      <div style={{ width: 72, height: 72, borderRadius: 16, background: '#F1F5F9', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 16, background: '#F1F5F9', borderRadius: 6, width: '40%' }} />
        <div style={{ height: 12, background: '#F1F5F9', borderRadius: 6, width: '65%' }} />
        <div style={{ height: 12, background: '#F1F5F9', borderRadius: 6, width: '30%' }} />
      </div>
      <div style={{ width: 88, height: 36, background: '#F1F5F9', borderRadius: 12, flexShrink: 0 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ORDER CARD COMPONENT
   ═══════════════════════════════════════════════════════ */
function OrderCard({ order }: { order: Order }) {
  const config = ORDER_STATUS_CONFIG[order.status]
  const isProcessing = PROCESSING_STATUSES.includes(order.status)
  const [isHovered, setIsHovered] = useState(false)

  const firstItem = order.items[0]
  const extraCount = order.items.reduce((sum, i) => sum + i.quantity, 0) - (firstItem?.quantity || 0)

  return (
    <NavLink
      to={`/orders/${order.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'block', textDecoration: 'none', color: 'inherit',
        background: '#fff', borderRadius: 16, padding: '18px 20px',
        border: `1px solid ${isHovered ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)'}`,
        boxShadow: isHovered
          ? '0 8px 24px -4px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {/* ── LEFT: Image ── */}
        <RestaurantImage src={order.restaurantImage} alt={order.restaurantName} />

        {/* ── MIDDLE: Info ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Restaurant name + Order code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h4 style={{
              fontSize: 15, fontWeight: 700, margin: 0,
              color: isHovered ? '#DC2626' : '#0F172A',
              transition: 'color 0.2s', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {order.restaurantName}
            </h4>
            <span style={{
              fontFamily: "'Roboto Mono', monospace", fontSize: 10.5, fontWeight: 700,
              color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px',
              borderRadius: 6, flexShrink: 0,
            }}>
              #{order.orderCode}
            </span>
          </div>

          {/* Items summary */}
          {firstItem && (
            <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0 0', lineHeight: 1.4 }}>
              <span style={{ fontWeight: 600, color: '#0F172A' }}>{firstItem.name}</span>
              {firstItem.quantity > 1 && (
                <span style={{
                  marginLeft: 6, fontSize: 11.5, fontWeight: 700, color: '#DC2626',
                  background: 'rgba(220,38,38,0.06)', padding: '1px 6px', borderRadius: 5,
                }}>
                  x{firstItem.quantity}
                </span>
              )}
              {extraCount > 0 && (
                <span style={{ color: '#94A3B8' }}> (và {extraCount} món khác)</span>
              )}
            </p>
          )}

          {/* Date/time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#94A3B8' }}>
            <Clock style={{ width: 13, height: 13 }} />
            <span>{formatDateTime(order.createdAt)}</span>
          </div>

          {/* Status badge */}
          <div style={{ marginTop: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 9999,
              fontSize: 11, fontWeight: 700, lineHeight: 1,
              background: config.badgeBg, color: config.badgeText,
              border: `1px solid ${config.borderColor}`,
            }}>
              <span className={isProcessing ? 'animate-pulse' : ''} style={{
                width: 6, height: 6, borderRadius: '50%', background: config.dotColor,
              }} />
              {config.label}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Price + CTA ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          justifyContent: 'center', gap: 10, flexShrink: 0,
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 2 }}>Tổng cộng</div>
            <div style={{
              fontSize: 17, fontWeight: 800, color: '#DC2626',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatPrice(order.total)}
            </div>
          </div>

          {config.ctaHighlight ? (
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 12, border: 'none',
              background: '#DC2626', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
              transition: 'all 0.2s',
            }}>
              <MapPin style={{ width: 14, height: 14 }} />
              {config.ctaLabel}
            </button>
          ) : (
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 12,
              background: '#F8FAFC', color: '#475569', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
              border: '1px solid #E2E8F0', transition: 'all 0.2s',
            }}>
              {order.status === 'DELIVERED' ? (
                <Star style={{ width: 14, height: 14, color: '#F59E0B' }} />
              ) : order.status === 'CANCELLED' ? (
                <RotateCcw style={{ width: 14, height: 14 }} />
              ) : (
                <Eye style={{ width: 14, height: 14 }} />
              )}
              {config.ctaLabel}
              <ChevronRight style={{ width: 14, height: 14, color: '#CBD5E1' }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Active order pulse strip ── */}
      {isProcessing && (
        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, rgba(239,246,255,0.6) 0%, rgba(238,242,255,0.3) 100%)',
          border: '1px solid rgba(191,219,254,0.5)',
          borderRadius: 12, padding: '10px 16px',
        }}>
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
            <span className="animate-ping" style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: '#60A5FA', opacity: 0.75,
            }} />
            <span style={{
              position: 'relative', width: 8, height: 8, borderRadius: '50%',
              background: '#3B82F6',
            }} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', lineHeight: 1.2 }}>
            {order.status === 'DELIVERING'
              ? 'Tài xế đang trên đường giao đến bạn'
              : 'Nhà hàng đang chuẩn bị món ngon cho bạn'}
          </span>
        </div>
      )}
    </NavLink>
  )
}

/* ═══════════════════════════════════════════════════════
   EMPTY STATE — Using inline styles to avoid Tailwind v4 text-wrap bugs
   ═══════════════════════════════════════════════════════ */
function EmptyState({ tab }: { tab: FilterTab }) {
  const config = {
    PROCESSING: { title: 'Không có đơn đang xử lý', desc: 'Đặt món ngay để thưởng thức những bữa ăn nóng hổi và ngon miệng nhé!', showCta: true },
    HISTORY: { title: 'Chưa có lịch sử mua hàng', desc: 'Các đơn hàng đã hoàn thành của bạn sẽ hiển thị đầy đủ ở đây.', showCta: true },
    REVIEWS: { title: 'Chưa có đánh giá nào', desc: 'Hãy thưởng thức món ăn ngon và gửi đánh giá để chia sẻ cảm nhận nhé.', showCta: false },
    DRAFT: { title: 'Không có đơn huỷ', desc: 'Các đơn hàng đã huỷ của bạn sẽ được lưu trữ ở đây.', showCta: false },
  }[tab]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
    }}>
      <div style={{
        width: 80, height: 80, background: '#fff', borderRadius: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <ClipboardList style={{ width: 36, height: 36, color: '#CBD5E1' }} />
      </div>
      <h3 style={{
        fontSize: 18, fontWeight: 800, color: '#0F172A',
        margin: '0 0 8px 0', letterSpacing: '-0.025em',
      }}>
        {config.title}
      </h3>
      <p style={{
        fontSize: 14, color: '#94A3B8', lineHeight: 1.6,
        margin: '0 0 28px 0', maxWidth: 320, width: '100%',
      }}>
        {config.desc}
      </p>
      {config.showCta && (
        <NavLink to="/">
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', border: 'none', borderRadius: 14,
            background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(220,38,38,0.2)',
            transition: 'all 0.3s',
          }}>
            Khám phá nhà hàng
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        </NavLink>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('PROCESSING')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch orders from API
  useEffect(() => {
    setIsLoading(true)
    orderApi.list(1, 50).then((res) => {
      const items = res.data || []
      setOrders(items.map(mapApiOrder))
    }).catch(() => {
      setOrders([])
    }).finally(() => setIsLoading(false))
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'PROCESSING') return PROCESSING_STATUSES.includes(order.status)
    if (activeTab === 'HISTORY') return order.status === 'DELIVERED'
    if (activeTab === 'REVIEWS') return order.status === 'DELIVERED'
    if (activeTab === 'DRAFT') return order.status === 'CANCELLED'
    return true
  })

  return (
    <div className="page-enter" style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* ── Sticky Glassmorphism Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <style>{`
          @media (min-width: 768px) {
            .orders-glassmorphism-header { top: 68px !important; }
          }
        `}</style>
        <div className="orders-glassmorphism-header" style={{
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div className="container" style={{ maxWidth: 768 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 16,
              padding: '20px 0',
            }}>
              {/* Row: Title + Tabs */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16,
              }}>
                {/* Title */}
                <div>
                  <h1 style={{
                    fontSize: 26, fontWeight: 800, color: '#0F172A',
                    margin: 0, letterSpacing: '-0.025em', lineHeight: 1.2,
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                  }}>
                    Đơn hàng của tôi
                  </h1>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 0 0', fontWeight: 500 }}>
                    Theo dõi, quản lý và đặt lại các món ăn yêu thích
                  </p>
                </div>

                {/* Segmented Control Tabs */}
                <div style={{
                  display: 'flex', gap: 4, padding: 4, borderRadius: 16,
                  background: '#F1F5F9', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                  overflowX: 'auto', flexShrink: 0,
                }} className="scrollbar-hide">
                  {FILTER_TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          padding: '8px 16px', borderRadius: 12, border: 'none',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          whiteSpace: 'nowrap', transition: 'all 0.3s',
                          background: isActive ? '#fff' : 'transparent',
                          color: isActive ? '#DC2626' : '#94A3B8',
                          boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                          transform: isActive ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order Cards List ── */}
      <div className="container" style={{ maxWidth: 768, paddingTop: 28, paddingBottom: 40 }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
