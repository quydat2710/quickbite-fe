import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, CreditCard, Banknote, Smartphone,
  ChevronRight, ShieldCheck, CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/stores'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

const paymentMethods = [
  { id: 'MOMO', label: 'Ví MoMo', icon: Smartphone, color: 'text-pink-500' },
  { id: 'VNPAY', label: 'VNPay QR', icon: CreditCard, color: 'text-info' },
  { id: 'COD', label: 'Tiền mặt (COD)', icon: Banknote, color: 'text-success' },
] as const

const savedAddresses = [
  { id: 'a1', label: 'Nhà', address: '227 Nguyễn Văn Cừ, Q.5, TP.HCM', isDefault: true },
  { id: 'a2', label: 'Công ty', address: '123 Lê Lợi, Q.1, TP.HCM', isDefault: false },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, restaurantName, getSubtotal, clearCart } = useCartStore()
  const [selectedPayment, setSelectedPayment] = useState<string>('MOMO')
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0])
  const [orderNotes, setOrderNotes] = useState('')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = 21000
  const total = subtotal + deliveryFee

  if (items.length === 0 && !showSuccess) {
    navigate('/cart')
    return null
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsProcessing(false)
    setShowSuccess(true)
    clearCart()
  }

  if (showSuccess) {
    return (
      <div className="page-enter min-h-screen bg-bg-white flex items-center justify-center">
        <div className="text-center px-6 content-narrow">
          <div className="h-20 w-20 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-5 animate-float">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-xl font-bold mb-1.5">Đặt hàng thành công!</h1>
          <p className="text-text-tertiary text-[13px] mb-1">Mã đơn: <span className="font-mono font-bold text-text-primary">QB20260516-00046</span></p>
          <p className="text-text-tertiary text-[13px] mb-6">
            {selectedPayment === 'COD' ? 'Nhà hàng đang xử lý đơn hàng của bạn.' : 'Thanh toán thành công. Nhà hàng đang chuẩn bị.'}
          </p>
          <div className="flex flex-col gap-2.5">
            <Button size="lg" className="w-full" onClick={() => navigate('/orders')}>
              Theo dõi đơn hàng
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
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
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors">
              <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
            </button>
            <h1 className="text-base font-bold">Xác nhận đơn hàng</h1>
          </div>
        </div>
      </div>

      <div className="container py-4 pb-36 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 content-wide">
          <div className="lg:col-span-2 space-y-3">
            {/* Delivery Address */}
            <div className="bg-bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Địa chỉ giao hàng
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-[12px] text-primary font-medium hover:underline flex items-center gap-0.5"
                >
                  Thay đổi <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </div>
              <div className="pl-5">
                <p className="text-[13px] font-medium text-text-primary">{selectedAddress.label}</p>
                <p className="text-[13px] text-text-secondary mt-0.5">{selectedAddress.address}</p>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-bg-white rounded-xl p-4">
              <h3 className="text-[14px] font-semibold mb-2.5">{restaurantName}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-5 w-5 bg-primary-light rounded-md flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                        {item.quantity}
                      </span>
                      <span className="text-text-primary truncate">{item.name}</span>
                    </div>
                    <span className="font-medium text-text-secondary shrink-0 ml-2">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-bg-white rounded-xl p-4">
              <h3 className="text-[14px] font-semibold mb-2">Ghi chú đơn hàng</h3>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ghi chú cho tài xế hoặc nhà hàng..."
                className="w-full p-2.5 text-[13px] bg-surface-active border-none rounded-lg placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={2}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-bg-white rounded-xl p-4">
              <h3 className="text-[14px] font-semibold mb-2.5 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Phương thức thanh toán
              </h3>
              <div className="space-y-1.5">
                {paymentMethods.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedPayment(id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 p-3 rounded-lg border transition-all text-left',
                      selectedPayment === id
                        ? 'border-primary bg-primary-light'
                        : 'border-border hover:border-border-hover'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', color)} />
                    <span className="text-[13px] font-medium flex-1">{label}</span>
                    <div className={cn(
                      'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                      selectedPayment === id ? 'border-primary' : 'border-border'
                    )}>
                      {selectedPayment === id && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-bg-white rounded-xl p-4 lg:sticky lg:top-20">
              <h3 className="text-[14px] font-semibold mb-3">Chi tiết thanh toán</h3>
              <div className="space-y-2.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tạm tính ({items.length} món)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Phí giao hàng</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="h-px bg-divider" />
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-base font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-4"
                isLoading={isProcessing}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? 'Đang xử lý...' : `Xác nhận đặt • ${formatPrice(total)}`}
              </Button>

              <div className="flex items-center justify-center gap-1 mt-2.5 text-text-disabled">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[10px]">Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} title="Chọn địa chỉ">
        <div className="space-y-1.5">
          {savedAddresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => { setSelectedAddress(addr); setShowAddressModal(false) }}
              className={cn(
                'w-full flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all',
                selectedAddress.id === addr.id
                  ? 'border-primary bg-primary-light'
                  : 'border-border hover:border-border-hover'
              )}
            >
              <MapPin className={cn('h-4 w-4 shrink-0', selectedAddress.id === addr.id ? 'text-primary' : 'text-text-tertiary')} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold">{addr.label}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{addr.address}</p>
              </div>
              {addr.isDefault && (
                <span className="text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded-md shrink-0">Mặc định</span>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
