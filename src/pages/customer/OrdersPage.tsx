import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ClipboardList, ArrowRight, ChevronRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { mockOrders } from '@/data/mock'
import type { OrderStatus } from '@/data/mock'

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', variant: 'warning' },
  PAID: { label: 'Đã thanh toán', variant: 'info' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'info' },
  PREPARING: { label: 'Đang chuẩn bị', variant: 'warning' },
  READY: { label: 'Sẵn sàng', variant: 'info' },
  PICKED_UP: { label: 'Đang giao', variant: 'info' },
  DELIVERED: { label: 'Đã giao', variant: 'success' },
  CANCELLED: { label: 'Đã huỷ', variant: 'error' },
}

type FilterTab = 'all' | 'active' | 'completed' | 'cancelled'

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang xử lý' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã huỷ' },
]

const activeStatuses: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP']

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = mockOrders.filter((order) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return activeStatuses.includes(order.status)
    if (activeFilter === 'completed') return order.status === 'DELIVERED'
    if (activeFilter === 'cancelled') return order.status === 'CANCELLED'
    return true
  })

  return (
    <div className="page-enter bg-bg min-h-screen">
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3 md:py-4">
          <h1 className="text-lg md:text-xl font-bold mb-3">Đơn hàng</h1>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  activeFilter === tab.id
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'bg-surface-active text-text-secondary hover:bg-surface-hover'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 content-narrow text-center">
            <div className="h-16 w-16 bg-surface-active rounded-xl flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-text-disabled" />
            </div>
            <h3 className="text-text-primary mb-1.5">
              {activeFilter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng'}
            </h3>
            <p className="text-[13px] text-text-tertiary mb-6 leading-relaxed">
              {activeFilter === 'all'
                ? 'Khám phá các nhà hàng gần bạn và đặt món ăn yêu thích ngay nào!'
                : 'Không có đơn hàng nào trong mục này.'}
            </p>
            {activeFilter === 'all' && (
              <NavLink to="/">
                <Button size="md" className="gap-1.5">
                  Khám phá nhà hàng
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            )}
          </div>
        ) : (
          <div className="space-y-2.5 content-medium">
            {filtered.map((order) => {
              const { label, variant } = statusConfig[order.status]
              const isActive = activeStatuses.includes(order.status)
              return (
                <NavLink
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-bg-white rounded-xl p-3.5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={order.restaurantImage}
                        alt={order.restaurantName}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                          {order.restaurantName}
                        </h4>
                        <p className="text-[10px] font-mono text-text-tertiary">{order.orderCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={variant} dot>{label}</Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-text-disabled" />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mb-2.5 pl-[46px]">
                    <Package className="h-3 w-3 text-text-tertiary shrink-0" />
                    <span className="line-clamp-1">
                      {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pl-[46px] pt-2 border-t border-divider">
                    <span className="text-[11px] text-text-tertiary">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[13px] font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>

                  {/* Active order indicator */}
                  {isActive && (
                    <div className="mt-2.5 pl-[46px]">
                      <div className="flex items-center gap-1.5 bg-info-bg rounded-lg px-2.5 py-1.5">
                        <span className="h-1.5 w-1.5 bg-info rounded-full animate-pulse" />
                        <span className="text-[11px] font-medium text-info">Đơn đang được xử lý</span>
                      </div>
                    </div>
                  )}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
