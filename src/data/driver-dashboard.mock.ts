// ── Driver Dashboard Mock Data ──

export type DeliveryStatus = 'OFFER' | 'GOING_TO_RESTAURANT' | 'PICKED_UP' | 'DELIVERING' | 'DELIVERED'

export interface DriverDelivery {
  id: string
  orderCode: string
  status: DeliveryStatus
  // Restaurant
  restaurantName: string
  restaurantAddress: string
  restaurantPhone: string
  restaurantLat: number
  restaurantLng: number
  // Customer
  customerName: string
  customerAddress: string
  customerPhone: string
  customerLat: number
  customerLng: number
  // Order info
  items: { name: string; qty: number }[]
  totalAmount: number
  deliveryFee: number
  paymentMethod: 'VNPAY' | 'MOMO' | 'COD'
  distanceKm: number
  createdAt: string
}

export const mockDriverInfo = {
  id: 'drv-001',
  name: 'Nguyễn Văn Tài',
  phone: '0901 555 789',
  avatar: '',
  vehicleType: 'MOTORBIKE' as const,
  licensePlate: '59-X1 23456',
  isOnline: true,
  avgRating: 4.8,
  totalTrips: 342,
}

export const mockDriverStats = {
  todayEarnings: 485000,
  todayTrips: 12,
  todayDistance: 38.5,
  todayOnlineHours: 5.2,
  weekEarnings: 3250000,
  monthEarnings: 12800000,
}

// Active delivery (driver is currently doing this)
export const mockActiveDelivery: DriverDelivery = {
  id: 'del-001',
  orderCode: 'QB-20260519-003',
  status: 'GOING_TO_RESTAURANT',
  restaurantName: 'Bún Bò Huế Đông Ba',
  restaurantAddress: '227 Nguyễn Văn Cừ, Q.5',
  restaurantPhone: '028 3835 1234',
  restaurantLat: 10.7628,
  restaurantLng: 106.6824,
  customerName: 'Nguyễn Văn An',
  customerAddress: '45 Trần Hưng Đạo, Q.1, TP.HCM',
  customerPhone: '0923 456 789',
  customerLat: 10.7721,
  customerLng: 106.6980,
  items: [
    { name: 'Bún bò giò heo', qty: 3 },
  ],
  totalAmount: 195000,
  deliveryFee: 15000,
  paymentMethod: 'MOMO',
  distanceKm: 3.2,
  createdAt: '2026-05-19T10:20:00',
}

// New delivery offer (popup)
export const mockDeliveryOffer: DriverDelivery = {
  id: 'del-002',
  orderCode: 'QB-20260519-010',
  status: 'OFFER',
  restaurantName: 'Phở Hà Nội 36',
  restaurantAddress: '112 Lý Tự Trọng, Q.1',
  restaurantPhone: '028 3822 5678',
  restaurantLat: 10.7740,
  restaurantLng: 106.6990,
  customerName: 'Trần Minh Châu',
  customerAddress: '88 Nguyễn Huệ, Q.1, TP.HCM',
  customerPhone: '0967 890 123',
  customerLat: 10.7735,
  customerLng: 106.7025,
  items: [
    { name: 'Phở bò tái', qty: 2 },
    { name: 'Gỏi cuốn', qty: 4 },
  ],
  totalAmount: 210000,
  deliveryFee: 20000,
  paymentMethod: 'COD',
  distanceKm: 2.1,
  createdAt: '2026-05-19T10:40:00',
}

// Delivery history
export const mockDeliveryHistory: (DriverDelivery & { completedAt: string; earning: number })[] = [
  { ...mockActiveDelivery, id: 'h-1', orderCode: 'QB-20260519-001', status: 'DELIVERED', completedAt: '2026-05-19T09:15:00', earning: 22000, restaurantName: 'Cơm Tấm Sài Gòn', customerName: 'Lê Thị Hương', distanceKm: 2.8, totalAmount: 120000, deliveryFee: 18000 },
  { ...mockActiveDelivery, id: 'h-2', orderCode: 'QB-20260519-002', status: 'DELIVERED', completedAt: '2026-05-19T09:50:00', earning: 25000, restaurantName: 'Bún Bò Huế Đông Ba', customerName: 'Phạm Thúy Nga', distanceKm: 4.1, totalAmount: 88000, deliveryFee: 22000 },
  { ...mockActiveDelivery, id: 'h-3', orderCode: 'QB-20260518-015', status: 'DELIVERED', completedAt: '2026-05-18T20:30:00', earning: 18000, restaurantName: 'Pizza Hut', customerName: 'Hoàng Đức Trung', distanceKm: 1.5, totalAmount: 250000, deliveryFee: 15000 },
  { ...mockActiveDelivery, id: 'h-4', orderCode: 'QB-20260518-012', status: 'DELIVERED', completedAt: '2026-05-18T19:00:00', earning: 30000, restaurantName: 'KFC Nguyễn Trãi', customerName: 'Vũ Thanh Tùng', distanceKm: 5.5, totalAmount: 180000, deliveryFee: 28000 },
  { ...mockActiveDelivery, id: 'h-5', orderCode: 'QB-20260518-008', status: 'DELIVERED', completedAt: '2026-05-18T12:45:00', earning: 20000, restaurantName: 'Bánh Mì Huỳnh Hoa', customerName: 'Đỗ Minh Châu', distanceKm: 3.0, totalAmount: 90000, deliveryFee: 18000 },
]

export const DELIVERY_STATUS_MAP: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  OFFER:                 { label: 'Đề xuất mới',         color: '#DC2626', bg: '#FEF2F2' },
  GOING_TO_RESTAURANT:   { label: 'Đang đến nhà hàng',   color: '#F59E0B', bg: '#FFFBEB' },
  PICKED_UP:             { label: 'Đã lấy hàng',         color: '#3B82F6', bg: '#EFF6FF' },
  DELIVERING:            { label: 'Đang giao',           color: '#8B5CF6', bg: '#F5F3FF' },
  DELIVERED:             { label: 'Đã giao',             color: '#10B981', bg: '#ECFDF5' },
}

export const formatVNDDriver = (n: number) => n.toLocaleString('vi-VN') + 'đ'
