// Mock data — orders

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED'

export interface MockOrder {
  id: string
  orderCode: string
  restaurantId: string
  restaurantName: string
  restaurantImage: string
  status: OrderStatus
  paymentMethod: 'VNPAY' | 'MOMO' | 'COD'
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
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

export const mockOrders: MockOrder[] = [
  {
    id: 'ord-1',
    orderCode: 'QB20260516-00045',
    restaurantId: '1',
    restaurantName: 'Bún Bò Huế 3 Đình',
    restaurantImage: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=100&h=100&fit=crop',
    status: 'PREPARING',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    items: [
      { name: 'Bún Bò Huế Đặc Biệt (Lớn)', quantity: 2, unitPrice: 85000 },
      { name: 'Trà Đá', quantity: 2, unitPrice: 5000 },
    ],
    subtotal: 180000,
    deliveryFee: 21000,
    totalAmount: 201000,
    deliveryAddress: '227 Nguyễn Văn Cừ, Q.5, TP.HCM',
    notes: 'Ít cay, thêm rau',
    createdAt: '2026-05-16T09:30:00',
    driverName: 'Nguyễn Văn Tài',
    driverPhone: '0912 345 678',
    driverPlate: '59P1-12345',
  },
  {
    id: 'ord-2',
    orderCode: 'QB20260515-00123',
    restaurantId: '2',
    restaurantName: 'Cơm Tấm Sài Gòn Ngon',
    restaurantImage: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop',
    status: 'DELIVERED',
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    items: [
      { name: 'Cơm Tấm Sườn Bì Chả', quantity: 1, unitPrice: 50000 },
      { name: 'Cơm Tấm Sườn Nướng', quantity: 1, unitPrice: 40000 },
    ],
    subtotal: 90000,
    deliveryFee: 15000,
    totalAmount: 105000,
    deliveryAddress: '227 Nguyễn Văn Cừ, Q.5, TP.HCM',
    notes: '',
    createdAt: '2026-05-15T12:15:00',
  },
  {
    id: 'ord-3',
    orderCode: 'QB20260514-00089',
    restaurantId: '4',
    restaurantName: 'Phở Bà Chiểu',
    restaurantImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=100&h=100&fit=crop',
    status: 'CANCELLED',
    paymentMethod: 'VNPAY',
    paymentStatus: 'REFUNDED',
    items: [
      { name: 'Phở Bò Tái Nạm', quantity: 1, unitPrice: 55000 },
    ],
    subtotal: 55000,
    deliveryFee: 20000,
    totalAmount: 75000,
    deliveryAddress: '227 Nguyễn Văn Cừ, Q.5, TP.HCM',
    notes: '',
    createdAt: '2026-05-14T18:45:00',
  },
  {
    id: 'ord-4',
    orderCode: 'QB20260513-00201',
    restaurantId: '3',
    restaurantName: 'Pizza Express',
    restaurantImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop',
    status: 'DELIVERED',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    items: [
      { name: 'Pizza Margherita (L)', quantity: 1, unitPrice: 159000 },
      { name: 'Coca Cola', quantity: 2, unitPrice: 20000 },
    ],
    subtotal: 199000,
    deliveryFee: 25000,
    totalAmount: 224000,
    deliveryAddress: '227 Nguyễn Văn Cừ, Q.5, TP.HCM',
    notes: 'Không hành',
    createdAt: '2026-05-13T19:20:00',
  },
]

// ── Notifications ──
export type NotifType = 'ORDER_CONFIRMED' | 'ORDER_CANCELLED' | 'DRIVER_ASSIGNED' | 'ORDER_DELIVERED' | 'PROMOTION'

export interface MockNotification {
  id: string
  type: NotifType
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

export const mockNotifications: MockNotification[] = [
  { id: 'n1', type: 'ORDER_CONFIRMED', title: 'Đơn hàng đã xác nhận', body: 'Bún Bò Huế 3 Đình đang chuẩn bị đơn #QB20260516-00045', isRead: false, createdAt: '2026-05-16T09:31:00' },
  { id: 'n2', type: 'DRIVER_ASSIGNED', title: 'Đã có tài xế', body: 'Tài xế Nguyễn Văn Tài đang đến nhà hàng lấy đơn', isRead: false, createdAt: '2026-05-16T09:35:00' },
  { id: 'n3', type: 'PROMOTION', title: 'Flash Sale 12H!', body: 'Giảm 50% tối đa 30K cho đơn từ 80K. Mã: FLASH50', isRead: false, createdAt: '2026-05-16T08:00:00' },
  { id: 'n4', type: 'ORDER_DELIVERED', title: 'Giao hàng thành công', body: 'Đơn #QB20260515-00123 đã giao. Đánh giá nhà hàng nhé!', isRead: true, createdAt: '2026-05-15T12:45:00' },
  { id: 'n5', type: 'ORDER_CANCELLED', title: 'Đơn đã huỷ', body: 'Đơn #QB20260514-00089 đã huỷ. Hoàn tiền trong 24h.', isRead: true, createdAt: '2026-05-14T18:50:00' },
  { id: 'n6', type: 'PROMOTION', title: 'Freeship cuối tuần', body: 'Miễn phí giao hàng mọi đơn từ 50K. Chỉ T7 & CN!', isRead: true, createdAt: '2026-05-11T09:00:00' },
]
