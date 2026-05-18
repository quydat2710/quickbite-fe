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
    <div className="page-enter bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 md:top-14 z-30 shadow-sm">
        <div className="container py-4 md:py-5">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 tracking-[-0.02em]">Đơn hàng</h1>

          {/* Filter Tabs — segmented control style */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'flex-1 px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all duration-200',
                  activeFilter === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-800 text-lg font-bold mb-1.5">
              {activeFilter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng'}
            </h3>
            <p className="text-[14px] text-gray-400 mb-6 leading-relaxed max-w-xs">
              {activeFilter === 'all'
                ? 'Khám phá các nhà hàng gần bạn và đặt món ăn yêu thích ngay nào!'
                : 'Không có đơn hàng nào trong mục này.'}
            </p>
            {activeFilter === 'all' && (
              <NavLink to="/">
                <Button size="md" className="gap-1.5 rounded-xl">
                  Khám phá nhà hàng
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl mx-auto">
            {filtered.map((order) => {
              const { label, variant } = statusConfig[order.status]
              const isActive = activeStatuses.includes(order.status)
              return (
                <NavLink
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl p-4 md:p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group border border-gray-100/60"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={order.restaurantImage}
                        alt={order.restaurantName}
                        className="h-12 w-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                      />
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                          {order.restaurantName}
                        </h4>
                        <p className="text-[12px] font-mono text-gray-400 mt-0.5">{order.orderCode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={variant} dot>{label}</Badge>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3 pl-[60px]">
                    <Package className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                    <span className="line-clamp-1 font-medium">
                      {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pl-[60px] pt-3 border-t border-gray-50">
                    <span className="text-[12px] text-gray-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[15px] font-extrabold text-primary">{formatPrice(order.totalAmount)}</span>
                  </div>

                  {/* Active order indicator */}
                  {isActive && (
                    <div className="mt-3 pl-[60px]">
                      <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[12px] font-bold text-blue-600">Đơn đang được xử lý</span>
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
