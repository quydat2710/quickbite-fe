import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, CreditCard, Banknote, Smartphone,
  ChevronRight, ShieldCheck, CheckCircle2,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore, useLocationStore } from '@/stores'
import { orderApi } from '@/services/api'
import api, { getErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

const paymentMethods = [
  { id: 'MOMO', label: 'Ví MoMo', icon: Smartphone, color: '#EC4899', bgColor: '#FDF2F8' },
  { id: 'VNPAY', label: 'VNPay QR', icon: CreditCard, color: '#2563EB', bgColor: '#EFF6FF' },
  { id: 'COD', label: 'Tiền mặt (COD)', icon: Banknote, color: '#16A34A', bgColor: '#F0FDF4' },
] as const


export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, restaurantName, getSubtotal, clearCart } = useCartStore()
  const { fullAddress, isDetected } = useLocationStore()
  const [selectedPayment, setSelectedPayment] = useState<string>('MOMO')

  // Build address list from API + current GPS
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; label: string; address: string; isDefault: boolean }[]>([])
  const [selectedAddress, setSelectedAddress] = useState<{ id: string; label: string; address: string; isDefault: boolean }>(
    { id: 'gps', label: 'Vị trí hiện tại', address: isDetected ? fullAddress : 'Đang xác định...', isDefault: true }
  )

  // Load saved addresses from API
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/me/addresses')
        const apiAddresses = (data.data || []).map((a: any) => ({
          id: a.id, label: a.label, address: a.address, isDefault: a.isDefault || false,
        }))

        // Prepend GPS address
        const gpsAddr = {
          id: 'gps', label: 'Vị trí hiện tại',
          address: isDetected ? fullAddress : 'Đang xác định...',
          isDefault: apiAddresses.length === 0,
        }
        const all = [gpsAddr, ...apiAddresses]
        setSavedAddresses(all)

        // Select default or GPS
        const def = apiAddresses.find((a: any) => a.isDefault)
        setSelectedAddress(def || gpsAddr)
      } catch {
        // Fallback to GPS only
        const gpsAddr = { id: 'gps', label: 'Vị trí hiện tại', address: isDetected ? fullAddress : 'Chưa xác định', isDefault: true }
        setSavedAddresses([gpsAddr])
        setSelectedAddress(gpsAddr)
      }
    }
    load()
  }, [isDetected, fullAddress])

  const [orderNotes, setOrderNotes] = useState('')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderError, setOrderError] = useState('')

  const subtotal = getSubtotal()
  const deliveryFee = 21000
  const total = subtotal + deliveryFee

  if (items.length === 0 && !showSuccess) {
    navigate('/cart')
    return null
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    setOrderError('')
    try {
      const restaurantId = useCartStore.getState().restaurantId
      await orderApi.create({
        restaurantId: restaurantId || '',
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          options: item.options,
          notes: item.notes || undefined,
          imageUrl: item.imageUrl,
        })),
        deliveryAddress: selectedAddress.address,
        note: orderNotes || undefined,
        paymentMethod: selectedPayment,
      })
      setShowSuccess(true)
      clearCart()
    } catch (err) {
      setOrderError(getErrorMessage(err))
    } finally {
      setIsProcessing(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="page-enter min-h-screen" style={{ background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '40px 32px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          border: '1px solid #F3F4F6',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
            background: 'linear-gradient(90deg, #16A34A, #4ADE80)',
          }} />
          <div className="animate-float" style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: 'rgba(22,163,74,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 style={{ width: '44px', height: '44px', color: '#16A34A' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '10px', color: '#0F172A' }}>Đặt hàng thành công!</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>
            Mã đơn: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A', background: '#F3F4F6', padding: '2px 8px', borderRadius: '6px' }}>QB20260516-00046</span>
          </p>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px', lineHeight: 1.6 }}>
            {selectedPayment === 'COD'
              ? 'Nhà hàng đang xử lý. Vui lòng thanh toán khi nhận hàng.'
              : 'Thanh toán thành công. Nhà hàng đang chuẩn bị món ăn cho bạn.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button size="lg" style={{ width: '100%', height: '48px', fontWeight: 700 }} onClick={() => navigate('/orders')}>
              Theo dõi đơn hàng
            </Button>
            <Button variant="ghost" size="lg" style={{ width: '100%', height: '48px' }} onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter min-h-screen" style={{ background: '#F5F5F7' }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #F3F4F6',
        position: 'sticky', top: 0, zIndex: 30,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div className="container" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: '8px', borderRadius: '50%', border: 'none',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <ArrowLeft style={{ width: '20px', height: '20px', color: '#475569' }} />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Xác nhận đơn hàng</h1>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
        <div className="content-wide checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Delivery Address */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: '#0F172A' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#DC2626' }} />
                  </div>
                  Địa chỉ giao hàng
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  style={{
                    fontSize: '13px', color: '#DC2626', fontWeight: 700, border: 'none',
                    background: 'transparent', cursor: 'pointer', padding: '6px 12px',
                    borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Thay đổi <ChevronRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
              <div style={{ paddingLeft: '42px' }}>
                <div style={{
                  background: 'rgba(243,244,246,0.6)', borderRadius: '14px', padding: '16px',
                  border: '1.5px dashed #E5E7EB',
                }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 6px 0' }}>
                    {selectedAddress.label}
                    {selectedAddress.isDefault && (
                      <span style={{
                        fontSize: '10px', fontWeight: 700, color: '#DC2626',
                        background: 'rgba(220,38,38,0.1)', padding: '2px 8px', borderRadius: '999px',
                      }}>Mặc định</span>
                    )}
                  </p>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>{selectedAddress.address}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0', color: '#0F172A' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(234,88,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Banknote style={{ width: '16px', height: '16px', color: '#EA580C' }} />
                </div>
                {restaurantName || 'Chi tiết món ăn'}
              </h3>
              <div style={{ paddingLeft: '42px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {items.map((item) => (
                  <div key={item.menuItemId} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
                      <span style={{
                        minWidth: '28px', height: '24px', background: '#F3F4F6', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 700, color: '#475569', flexShrink: 0,
                        border: '1px solid #E5E7EB',
                      }}>
                        {item.quantity}x
                      </span>
                      <span style={{ color: '#0F172A', fontWeight: 600, paddingTop: '2px' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#0F172A', flexShrink: 0, marginLeft: '16px', paddingTop: '2px' }}>
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 8px' }}>Ghi chú cho nhà hàng</h3>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ví dụ: Không hành, thêm tương ớt..."
                rows={2}
                style={{
                  width: '100%', padding: '14px 16px', fontSize: '14px',
                  background: '#F5F5F7', border: '1.5px solid #E5E7EB',
                  borderRadius: '14px', outline: 'none', resize: 'none',
                  fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.6, boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  color: '#0F172A',
                }}
                onFocus={e => { e.target.style.borderColor = '#DC2626'; e.target.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.12)' }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Payment Methods */}
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 16px 0', color: '#0F172A' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CreditCard style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                </div>
                Phương thức thanh toán
              </h3>
              <div style={{ paddingLeft: '42px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentMethods.map(({ id, label, icon: Icon, color, bgColor }) => {
                  const isActive = selectedPayment === id
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedPayment(id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 16px', borderRadius: '14px', textAlign: 'left', cursor: 'pointer',
                        border: isActive ? '2px solid #DC2626' : '1.5px solid #E5E7EB',
                        background: isActive ? 'rgba(220,38,38,0.04)' : '#fff',
                        boxShadow: isActive ? '0 0 0 3px rgba(220,38,38,0.1)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: bgColor, border: '1px solid #E5E7EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      }}>
                        <Icon style={{ width: '20px', height: '20px', color }} />
                      </div>
                      <span style={{
                        fontSize: '15px', flex: 1,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#DC2626' : '#0F172A',
                      }}>{label}</span>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        border: isActive ? '2px solid #DC2626' : '2px solid #D1D5DB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s',
                      }}>
                        {isActive && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DC2626' }} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div style={{
              background: '#fff', borderRadius: '20px', padding: '24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.05)',
              position: 'sticky', top: '80px',
            }}>
              <h3 style={{
                fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 20px 0',
                paddingBottom: '16px', borderBottom: '1.5px solid #F3F4F6',
              }}>
                Hóa đơn thanh toán
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Tạm tính ({items.length} món)</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{formatPrice(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Phí giao hàng</span>
                  <span style={{ fontWeight: 600, color: '#0F172A' }}>{formatPrice(deliveryFee)}</span>
                </div>

                {/* Receipt dashed divider */}
                <div style={{ position: 'relative', margin: '4px -24px', padding: '0 24px' }}>
                  <div style={{ borderTop: '2px dashed #E5E7EB' }} />
                  <div style={{
                    position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)',
                    width: '16px', height: '16px', borderRadius: '50%', background: '#F5F5F7',
                  }} />
                  <div style={{
                    position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)',
                    width: '16px', height: '16px', borderRadius: '50%', background: '#F5F5F7',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>Tổng cộng</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '26px', fontWeight: 900, color: '#DC2626', display: 'block', lineHeight: 1.1 }}>
                      {formatPrice(total)}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Đã bao gồm thuế (nếu có)</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1.5px solid #F3F4F6' }}>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  style={{
                    width: '100%', height: '56px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)',
                    color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 8px 24px rgba(220,38,38,0.35)',
                    transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s',
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!isProcessing) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.45)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.35)' }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'none' }}
                >
                  {isProcessing ? 'Đang xử lý...' : `Đặt hàng • ${formatPrice(total)}`}
                </button>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  marginTop: '14px', padding: '8px 12px', borderRadius: '10px',
                  background: 'rgba(22,163,74,0.06)',
                }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#16A34A', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>Thanh toán an toàn & bảo mật 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} title="Chọn địa chỉ giao hàng">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '4px' }}>
          {savedAddresses.map((addr) => {
            const isActive = selectedAddress.id === addr.id
            return (
              <button
                key={addr.id}
                onClick={() => { setSelectedAddress(addr); setShowAddressModal(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px', borderRadius: '16px', textAlign: 'left', cursor: 'pointer',
                  border: isActive ? '2px solid #DC2626' : '1.5px solid #E5E7EB',
                  background: isActive ? 'rgba(220,38,38,0.04)' : '#fff',
                  boxShadow: isActive ? '0 0 0 3px rgba(220,38,38,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                  border: isActive ? '2px solid #DC2626' : '2px solid #D1D5DB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isActive && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DC2626' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: isActive ? 700 : 600, color: isActive ? '#DC2626' : '#0F172A', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {addr.label}
                    {addr.isDefault && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#DC2626', background: 'rgba(220,38,38,0.1)', padding: '1px 8px', borderRadius: '999px' }}>Mặc định</span>
                    )}
                  </p>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{addr.address}</p>
                </div>
              </button>
            )
          })}
          <button style={{
            width: '100%', height: '48px', borderRadius: '14px', cursor: 'pointer',
            border: '2px dashed rgba(220,38,38,0.3)', background: 'transparent',
            color: '#DC2626', fontSize: '14px', fontWeight: 700, fontFamily: 'Inter, sans-serif',
            transition: 'background 0.2s',
            marginTop: '4px',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            + Thêm địa chỉ mới
          </button>
        </div>
      </Modal>
    </div>
  )
}
