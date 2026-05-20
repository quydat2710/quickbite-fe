import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowLeft, Phone, MessageCircle, MapPin, Clock,
  ChefHat, Truck, CheckCircle2, Package, XCircle, CreditCard, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { orderApi } from '@/services/api'

type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED'

interface TrackingOrder {
  id: string
  orderCode: string
  restaurantId: string
  restaurantName: string
  restaurantImage: string
  status: OrderStatus
  paymentMethod: string
  paymentStatus: string
  items: Array<{ name: string; quantity: number; unitPrice: number }>
  subtotal: number
  deliveryFee: number
  totalAmount: number
  deliveryAddress: string
  notes: string
  createdAt: string
  driverName?: string
  driverPhone?: string
  driverPlate?: string
}

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
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  PAID: { label: 'Đã thanh toán', variant: 'info' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'info' },
  PREPARING: { label: 'Đang chuẩn bị', variant: 'warning' },
  READY: { label: 'Sẵn sàng giao', variant: 'info' },
  PICKED_UP: { label: 'Đang giao', variant: 'info' },
  DELIVERING: { label: 'Đang giao', variant: 'info' },
  DELIVERED: { label: 'Đã giao', variant: 'success' },
  CANCELLED: { label: 'Đã huỷ', variant: 'error' },
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<TrackingOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    orderApi.getById(id)
      .then((apiOrder: any) => {
        // Map API order → TrackingOrder
        setOrder({
          id: apiOrder.id,
          orderCode: apiOrder.id?.slice(0, 8)?.toUpperCase() || apiOrder.id,
          restaurantId: apiOrder.restaurantId,
          restaurantName: apiOrder.restaurantName || 'Nhà hàng',
          restaurantImage: '',
          status: (apiOrder.status || 'PENDING') as OrderStatus,
          paymentMethod: apiOrder.paymentMethod || 'COD',
          paymentStatus: 'PAID',
          items: (apiOrder.items || []).map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          subtotal: apiOrder.subtotal || 0,
          deliveryFee: apiOrder.deliveryFee || 0,
          totalAmount: apiOrder.total || 0,
          deliveryAddress: apiOrder.deliveryAddress || '',
          notes: apiOrder.note || '',
          createdAt: apiOrder.createdAt,
          driverName: undefined,
          driverPhone: undefined,
          driverPlate: undefined,
        })
      })
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

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
    <div className="page-enter w-full min-h-screen bg-slate-50 pb-10">
      <style>{`
        .order-tracking-sticky-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #fff;
          border-bottom: 1px solid #f3f4f6;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        @media (min-width: 768px) {
          .order-tracking-sticky-header {
            top: 68px;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="order-tracking-sticky-header">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Chi tiết đơn hàng</h1>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{order.orderCode}</p>
              </div>
            </div>
            <Badge variant={badge.variant} dot>{badge.label}</Badge>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
        {/* Map Placeholder */}
        {!isCancelled && !isDelivered && (
          <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
            <div className="h-[160px] md:h-[200px] bg-emerald-50 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-bold text-emerald-700">Bản đồ theo dõi thời gian thực</p>
                <p className="text-xs text-emerald-600 mt-1">Tích hợp khi kết nối Backend</p>
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
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900 mb-4">Trạng thái đơn hàng</h3>

          {isCancelled ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <XCircle className="h-8 w-8 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700">Đơn hàng đã bị huỷ</p>
                <p className="text-xs text-red-600 mt-1">
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
                  <div key={step.status} className="flex gap-3">
                    {/* Line & Dot */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm',
                        state === 'completed' && 'bg-green-500 text-white',
                        state === 'active' && 'bg-red-500 text-white ring-4 ring-red-50',
                        state === 'pending' && 'bg-gray-100 text-gray-400 shadow-none border border-gray-200',
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {!isLast && (
                        <div className={cn(
                          'w-0.5 h-8 my-1 rounded-full',
                          state === 'completed' || state === 'active' ? 'bg-green-500' : 'bg-gray-200',
                        )} />
                      )}
                    </div>

                    {/* Label */}
                    <div className="pt-1.5 pb-2">
                      <p className={cn(
                        'text-sm font-bold',
                        state === 'pending' ? 'text-gray-400' : 'text-gray-900',
                      )}>
                        {step.label}
                      </p>
                      {state === 'active' && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-xs text-red-500 font-semibold">Đang thực hiện</span>
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* PAID STAMP overlay */}
          {order.paymentStatus === 'PAID' && (
            <div className="absolute top-5 right-2 md:right-5 pointer-events-none transform rotate-[12deg] z-10">
              <div className="border-2 border-emerald-500 text-emerald-500 rounded-lg px-2.5 py-1 font-black text-[12px] md:text-[14px] uppercase tracking-widest opacity-80 bg-emerald-50/80 backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Đã thanh toán
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 relative z-20">
            <img src={order.restaurantImage} alt={order.restaurantName} className="h-10 w-10 rounded-xl object-cover border border-gray-100" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">{order.restaurantName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[14px]">
                <span className="text-gray-700 font-medium">
                  <span className="text-gray-900 font-bold mr-1.5">{item.quantity}x</span> 
                  {item.name}
                </span>
                <span className="font-bold text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-[14px]">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Tạm tính</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Phí giao hàng</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100 mt-2">
              <span className="text-[15px] font-bold text-gray-900">Tổng cộng</span>
              <span className="text-lg font-bold text-red-500">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery address */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Giao đến</p>
                <p className="text-sm font-medium text-gray-900 leading-relaxed">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Thanh toán bằng</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.paymentMethod === 'COD' ? 'Tiền mặt (COD)' : order.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
