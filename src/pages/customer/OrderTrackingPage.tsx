import { useParams, NavLink, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Clock,
  ChefHat, Truck, CheckCircle2, Package, XCircle, CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { mockOrders } from '@/data/mock'
import type { OrderStatus } from '@/data/mock'

const statusSteps: Array<{
  status: OrderStatus
  label: string
  icon: React.ElementType
}> = [
  { status: 'PAID', label: 'Đã thanh toán', icon: CreditCard },
  { status: 'CONFIRMED', label: 'Nhà hàng xác nhận', icon: CheckCircle2 },
  { status: 'PREPARING', label: 'Đang chuẩn bị', icon: ChefHat },
  { status: 'READY', label: 'Sẵn sàng giao', icon: Package },
  { status: 'PICKED_UP', label: 'Tài xế đã lấy', icon: Truck },
  { status: 'DELIVERED', label: 'Đã giao hàng', icon: CheckCircle2 },
]

const statusOrder: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP', 'DELIVERED']

function getStepState(currentStatus: OrderStatus, stepStatus: OrderStatus): 'completed' | 'active' | 'pending' {
  const currentIdx = statusOrder.indexOf(currentStatus)
  const stepIdx = statusOrder.indexOf(stepStatus)
  if (stepIdx < currentIdx) return 'completed'
  if (stepIdx === currentIdx) return 'active'
  return 'pending'
}

const statusBadgeConfig: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', variant: 'warning' },
  PAID: { label: 'Đã thanh toán', variant: 'info' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'info' },
  PREPARING: { label: 'Đang chuẩn bị', variant: 'warning' },
  READY: { label: 'Sẵn sàng giao', variant: 'info' },
  PICKED_UP: { label: 'Đang giao', variant: 'info' },
  DELIVERED: { label: 'Đã giao', variant: 'success' },
  CANCELLED: { label: 'Đã huỷ', variant: 'error' },
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = mockOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-1.5">Không tìm thấy đơn hàng</h2>
          <NavLink to="/orders" className="text-primary font-medium text-[13px] hover:underline">Quay lại danh sách</NavLink>
        </div>
      </div>
    )
  }

  const isCancelled = order.status === 'CANCELLED'
  const isDelivered = order.status === 'DELIVERED'
  const badge = statusBadgeConfig[order.status]

  return (
    <div className="page-enter min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors">
                <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
              </button>
              <div>
                <h1 className="text-base font-bold">Chi tiết đơn hàng</h1>
                <p className="text-[10px] font-mono text-text-tertiary">{order.orderCode}</p>
              </div>
            </div>
            <Badge variant={badge.variant} dot>{badge.label}</Badge>
          </div>
        </div>
      </div>

      <div className="container py-4 content-medium">
        {/* Map Placeholder */}
        {!isCancelled && !isDelivered && (
          <div className="bg-bg-white rounded-xl overflow-hidden mb-3 shadow-xs">
            <div className="h-[160px] md:h-[200px] bg-gradient-to-br from-info-bg via-surface-active to-success-bg flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-7 w-7 text-primary mx-auto mb-1.5 animate-float" />
                <p className="text-[13px] font-medium text-text-secondary">Bản đồ theo dõi thời gian thực</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Tích hợp khi kết nối Backend</p>
              </div>
            </div>
          </div>
        )}

        {/* Driver Info */}
        {order.driverName && !isCancelled && (
          <div className="bg-bg-white rounded-xl p-3.5 mb-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center text-white text-[13px] font-bold">
                  {order.driverName[0]}
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{order.driverName}</p>
                  <p className="text-[11px] text-text-tertiary">{order.driverPlate}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button className="h-9 w-9 rounded-lg bg-success-bg flex items-center justify-center hover:bg-success/10 transition-colors">
                  <Phone className="h-4 w-4 text-success" />
                </button>
                <button className="h-9 w-9 rounded-lg bg-info-bg flex items-center justify-center hover:bg-info/10 transition-colors">
                  <MessageCircle className="h-4 w-4 text-info" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-bg-white rounded-xl p-4 mb-3 shadow-xs">
          <h3 className="text-[14px] font-semibold mb-3">Trạng thái đơn hàng</h3>

          {isCancelled ? (
            <div className="flex items-center gap-2.5 p-3 bg-error-bg rounded-lg">
              <XCircle className="h-7 w-7 text-error shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-error">Đơn hàng đã bị huỷ</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">
                  {order.paymentStatus === 'REFUNDED' ? 'Đã hoàn tiền về tài khoản.' : 'Không phát sinh phí.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {statusSteps.map((step, index) => {
                const state = getStepState(order.status, step.status)
                const Icon = step.icon
                const isLast = index === statusSteps.length - 1
                return (
                  <div key={step.status} className="flex gap-2.5">
                    {/* Line & Dot */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-all',
                        state === 'completed' && 'bg-success text-white',
                        state === 'active' && 'bg-primary text-white ring-3 ring-primary/20',
                        state === 'pending' && 'bg-surface-active text-text-disabled',
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      {!isLast && (
                        <div className={cn(
                          'w-0.5 h-6 my-0.5',
                          state === 'completed' || state === 'active' ? 'bg-success' : 'bg-border',
                        )} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="pt-1">
                      <p className={cn(
                        'text-[13px] font-medium',
                        state === 'pending' ? 'text-text-disabled' : 'text-text-primary',
                      )}>
                        {step.label}
                      </p>
                      {state === 'active' && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                          <span className="text-[11px] text-primary font-medium">Đang thực hiện</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-bg-white rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <img src={order.restaurantImage} alt={order.restaurantName} className="h-9 w-9 rounded-lg object-cover" />
            <div>
              <h3 className="text-[13px] font-semibold">{order.restaurantName}</h3>
              <p className="text-[10px] text-text-tertiary">
                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 mb-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[13px]">
                <span className="text-text-secondary">{item.quantity}x {item.name}</span>
                <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-divider pt-2.5 space-y-1.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Tạm tính</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Phí giao hàng</span>
              <span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-divider">
              <span className="font-semibold">Tổng cộng</span>
              <span className="text-base font-bold text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="mt-3 pt-2.5 border-t border-divider">
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-text-tertiary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-medium text-text-tertiary">Giao đến</p>
                <p className="text-[13px] text-text-primary">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-text-tertiary" />
            <span className="text-[11px] text-text-tertiary">Thanh toán:</span>
            <span className="text-[11px] font-medium text-text-primary">{order.paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
