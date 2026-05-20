import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, ShoppingBasket, MapPin } from 'lucide-react'
import { useCartStore } from '@/stores'
import { formatPrice } from '@/lib/utils'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Button } from '@/components/ui/Button'
import { useEffect } from 'react'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, restaurantName, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()
  const deliveryFee = subtotal > 0 ? 15000 + Math.floor(Math.random() * 10000) : 0
  const total = subtotal + deliveryFee

  // Responsive 2-col layout without Tailwind grid classes
  useEffect(() => {
    const grid = document.getElementById('cart-grid')
    if (!grid) return
    const update = () => {
      grid.style.gridTemplateColumns = window.innerWidth >= 1024
        ? 'minmax(0, 2fr) minmax(0, 1fr)'
        : 'minmax(0, 1fr)'
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (items.length === 0) {
    return (
      <div className="page-enter min-h-screen bg-bg-white">
        <div className="container py-4">
          <div className="flex items-center gap-2.5 mb-6">
            <NavLink to="/" className="p-2 rounded-lg hover:bg-surface-active transition-colors">
              <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
            </NavLink>
            <h1 className="text-lg font-bold">Giỏ hàng</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-14 text-center content-narrow">
            <div className="h-16 w-16 bg-surface-active rounded-xl flex items-center justify-center mb-4">
              <ShoppingBasket className="h-8 w-8 text-text-disabled" />
            </div>
            <h3 className="text-text-primary mb-1.5">Giỏ hàng trống</h3>
            <p className="text-[13px] text-text-tertiary mb-6 leading-relaxed">Thêm món ăn yêu thích vào giỏ hàng ngay nào!</p>
            <NavLink to="/">
              <Button size="md">Khám phá nhà hàng</Button>
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

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
                <h1 className="text-base font-bold">Giỏ hàng</h1>
                <p className="text-[11px] text-text-tertiary">{restaurantName}</p>
              </div>
            </div>
            <button onClick={clearCart} className="text-[12px] text-error font-medium hover:underline flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              Xoá tất cả
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 20px 144px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr)', gap: 16 }} id="cart-grid">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => {
              const optionsExtra = item.options.reduce((s, o) => s + o.extraPrice, 0)
              const itemTotal = (item.unitPrice + optionsExtra) * item.quantity
              return (
                <div key={item.menuItemId} className="bg-bg-white rounded-xl p-3.5">
                  <div className="flex gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[13px] font-semibold text-text-primary line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="p-1 rounded-md hover:bg-error-bg transition-colors shrink-0"
                        >
                          <Trash2 className="h-3 w-3 text-text-tertiary hover:text-error" />
                        </button>
                      </div>
                      {item.options.length > 0 && (
                        <p className="text-[10px] text-text-tertiary mt-0.5">
                          {item.options.map((o) => o.optionName).join(', ')}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-[10px] text-text-disabled mt-0.5 italic">"{item.notes}"</p>
                      )}
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[13px] font-bold text-primary">{formatPrice(itemTotal)}</span>
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(v) => updateQuantity(item.menuItemId, v)}
                          min={0}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div id="cart-summary">
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, position: 'sticky', top: 88 }}>
              <h3 className="font-semibold text-[14px] mb-3">Tổng đơn hàng</h3>

              <div className="space-y-2.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tạm tính</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Phí giao hàng
                  </span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="h-px bg-divider" />
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-base font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <NavLink to="/checkout" className="block mt-4">
                <Button size="lg" className="w-full">
                  Đặt hàng • {formatPrice(total)}
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
