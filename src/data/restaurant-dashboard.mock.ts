// ── Restaurant Dashboard Mock Data ──

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface DashboardOrder {
  id: string
  code: string
  customerName: string
  customerPhone: string
  items: { name: string; qty: number; options?: string; price: number }[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentMethod: 'VNPAY' | 'MOMO' | 'COD'
  createdAt: string
  note?: string
}

export interface MenuCategory {
  id: string
  name: string
  sortOrder: number
  itemCount: number
}

export interface DashboardMenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image: string
  isAvailable: boolean
  totalSold: number
}

export interface DashboardReview {
  id: string
  customerName: string
  rating: number
  comment: string
  reply?: string
  orderCode: string
  createdAt: string
}

// ── Stats ──
export const mockRestaurantInfo = {
  id: 'rest-001',
  name: 'Bún Bò Huế Đông Ba',
  description: 'Quán bún bò Huế truyền thống, nổi tiếng với nước dùng đậm đà, thơm sả, ớt đặc trưng xứ Huế.',
  address: '227 Nguyễn Văn Cừ, Phường 4, Q.5, TP. HCM',
  phone: '028 3835 1234',
  coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
  logo: '/logo_quickbite.png',
  openTime: '07:00',
  closeTime: '22:00',
  isOnline: true,
  avgRating: 4.6,
  totalOrders: 2847,
  totalReviews: 456,
}

export const mockDashboardStats = {
  revenueToday: 4850000,
  ordersToday: 38,
  completionRate: 92,
  avgRating: 4.6,
  revenueDelta: 12.5,   // % so với hôm qua
  ordersDelta: 8.2,
}

export const mockRevenueChart = [
  { day: 'T2', revenue: 3200000 },
  { day: 'T3', revenue: 4100000 },
  { day: 'T4', revenue: 3800000 },
  { day: 'T5', revenue: 5200000 },
  { day: 'T6', revenue: 4600000 },
  { day: 'T7', revenue: 6800000 },
  { day: 'CN', revenue: 4850000 },
]

export const mockTopItems = [
  { name: 'Bún bò Huế đặc biệt', sold: 156, revenue: 8580000 },
  { name: 'Bún bò giò heo', sold: 124, revenue: 7440000 },
  { name: 'Bún bò tái', sold: 98, revenue: 4900000 },
  { name: 'Bánh bèo chén', sold: 87, revenue: 2610000 },
  { name: 'Nước mía', sold: 201, revenue: 3015000 },
]

// ── Orders ──
export const mockDashboardOrders: DashboardOrder[] = [
  {
    id: 'ord-001', code: 'QB-20260519-001',
    customerName: 'Trần Minh Khoa', customerPhone: '0901 234 567',
    items: [
      { name: 'Bún bò Huế đặc biệt', qty: 2, options: 'Size lớn', price: 65000 },
      { name: 'Bánh bèo chén', qty: 1, price: 30000 },
    ],
    subtotal: 160000, deliveryFee: 15000, total: 175000,
    status: 'NEW', paymentMethod: 'VNPAY', createdAt: '2026-05-19T10:32:00',
    note: 'Ít cay',
  },
  {
    id: 'ord-002', code: 'QB-20260519-002',
    customerName: 'Lê Thị Hương', customerPhone: '0912 345 678',
    items: [
      { name: 'Bún bò tái', qty: 1, price: 50000 },
      { name: 'Nước mía', qty: 2, price: 15000 },
    ],
    subtotal: 80000, deliveryFee: 20000, total: 100000,
    status: 'NEW', paymentMethod: 'COD', createdAt: '2026-05-19T10:35:00',
  },
  {
    id: 'ord-003', code: 'QB-20260519-003',
    customerName: 'Nguyễn Văn An', customerPhone: '0923 456 789',
    items: [
      { name: 'Bún bò giò heo', qty: 3, options: 'Thêm huyết, Thêm chả', price: 60000 },
    ],
    subtotal: 180000, deliveryFee: 15000, total: 195000,
    status: 'PREPARING', paymentMethod: 'MOMO', createdAt: '2026-05-19T10:20:00',
  },
  {
    id: 'ord-004', code: 'QB-20260519-004',
    customerName: 'Phạm Thúy Nga', customerPhone: '0934 567 890',
    items: [
      { name: 'Bún bò Huế đặc biệt', qty: 1, price: 55000 },
      { name: 'Nước mía', qty: 1, price: 15000 },
    ],
    subtotal: 70000, deliveryFee: 18000, total: 88000,
    status: 'PREPARING', paymentMethod: 'VNPAY', createdAt: '2026-05-19T10:15:00',
  },
  {
    id: 'ord-005', code: 'QB-20260519-005',
    customerName: 'Hoàng Đức Trung', customerPhone: '0945 678 901',
    items: [
      { name: 'Bún bò tái', qty: 2, price: 50000 },
      { name: 'Bánh bèo chén', qty: 2, price: 30000 },
    ],
    subtotal: 160000, deliveryFee: 15000, total: 175000,
    status: 'READY', paymentMethod: 'COD', createdAt: '2026-05-19T09:55:00',
  },
  {
    id: 'ord-006', code: 'QB-20260519-006',
    customerName: 'Vũ Thanh Tùng', customerPhone: '0956 789 012',
    items: [
      { name: 'Bún bò giò heo', qty: 1, options: 'Size lớn', price: 60000 },
    ],
    subtotal: 60000, deliveryFee: 22000, total: 82000,
    status: 'COMPLETED', paymentMethod: 'VNPAY', createdAt: '2026-05-19T09:30:00',
  },
  {
    id: 'ord-007', code: 'QB-20260519-007',
    customerName: 'Đỗ Minh Châu', customerPhone: '0967 890 123',
    items: [
      { name: 'Bún bò Huế đặc biệt', qty: 1, price: 55000 },
    ],
    subtotal: 55000, deliveryFee: 15000, total: 70000,
    status: 'COMPLETED', paymentMethod: 'MOMO', createdAt: '2026-05-19T09:10:00',
  },
  {
    id: 'ord-008', code: 'QB-20260519-008',
    customerName: 'Bùi Quang Huy', customerPhone: '0978 901 234',
    items: [
      { name: 'Bún bò tái', qty: 1, price: 50000 },
      { name: 'Nước mía', qty: 1, price: 15000 },
    ],
    subtotal: 65000, deliveryFee: 20000, total: 85000,
    status: 'CANCELLED', paymentMethod: 'COD', createdAt: '2026-05-19T08:45:00',
    note: 'Khách huỷ vì chờ lâu',
  },
]

// ── Menu Categories ──
export const mockMenuCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Bún bò', sortOrder: 1, itemCount: 5 },
  { id: 'cat-2', name: 'Bánh', sortOrder: 2, itemCount: 3 },
  { id: 'cat-3', name: 'Đồ uống', sortOrder: 3, itemCount: 4 },
  { id: 'cat-4', name: 'Topping thêm', sortOrder: 4, itemCount: 3 },
]

// ── Menu Items ──
export const mockDashboardMenuItems: DashboardMenuItem[] = [
  { id: 'mi-1', categoryId: 'cat-1', name: 'Bún bò Huế đặc biệt', description: 'Bún bò đầy đủ giò heo, tái, chả, huyết', price: 55000, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 156 },
  { id: 'mi-2', categoryId: 'cat-1', name: 'Bún bò giò heo', description: 'Bún bò với giò heo hầm mềm', price: 60000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 124 },
  { id: 'mi-3', categoryId: 'cat-1', name: 'Bún bò tái', description: 'Bún bò với thịt bò tái mềm', price: 50000, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 98 },
  { id: 'mi-4', categoryId: 'cat-1', name: 'Bún bò chả', description: 'Bún bò với chả cua', price: 55000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop', isAvailable: false, totalSold: 67 },
  { id: 'mi-5', categoryId: 'cat-1', name: 'Bún bò khô', description: 'Bún bò trộn sốt đặc biệt', price: 50000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 45 },
  { id: 'mi-6', categoryId: 'cat-2', name: 'Bánh bèo chén', description: 'Bánh bèo nhân tôm chấm nước mắm', price: 30000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 87 },
  { id: 'mi-7', categoryId: 'cat-2', name: 'Bánh nậm', description: 'Bánh nậm nhân tôm thịt', price: 25000, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 56 },
  { id: 'mi-8', categoryId: 'cat-2', name: 'Bánh lọc', description: 'Bánh lọc gói lá chuối', price: 28000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 43 },
  { id: 'mi-9', categoryId: 'cat-3', name: 'Nước mía', description: 'Nước mía tươi', price: 15000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 201 },
  { id: 'mi-10', categoryId: 'cat-3', name: 'Trà đá', description: 'Trà đá miễn phí', price: 0, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 350 },
  { id: 'mi-11', categoryId: 'cat-3', name: 'Nước ngọt', description: 'Coca, Pepsi, 7Up', price: 12000, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 89 },
  { id: 'mi-12', categoryId: 'cat-3', name: 'Bia Saigon', description: 'Bia Saigon Special lon', price: 18000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 78 },
  { id: 'mi-13', categoryId: 'cat-4', name: 'Thêm huyết', description: '', price: 5000, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 134 },
  { id: 'mi-14', categoryId: 'cat-4', name: 'Thêm chả', description: '', price: 8000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 112 },
  { id: 'mi-15', categoryId: 'cat-4', name: 'Thêm giò', description: '', price: 10000, image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&auto=format&fit=crop', isAvailable: true, totalSold: 89 },
]

// ── Reviews ──
export const mockDashboardReviews: DashboardReview[] = [
  { id: 'rv-1', customerName: 'Minh Châu', rating: 5, comment: 'Bún bò rất ngon, nước dùng đậm đà, giao hàng nhanh!', orderCode: 'QB-20260518-045', createdAt: '2026-05-18T14:30:00', reply: 'Cảm ơn bạn đã ủng hộ! Hẹn gặp lại bạn ❤️' },
  { id: 'rv-2', customerName: 'Thanh Tùng', rating: 4, comment: 'Món ăn ngon nhưng giao hơi lâu. Nước dùng rất chuẩn vị Huế.', orderCode: 'QB-20260518-038', createdAt: '2026-05-18T12:15:00' },
  { id: 'rv-3', customerName: 'Thúy Nga', rating: 5, comment: 'Lần nào đặt cũng ngon, bún bò đặc biệt là best seller xứng đáng!', orderCode: 'QB-20260517-022', createdAt: '2026-05-17T20:00:00', reply: 'Cảm ơn bạn nhiều! Bún bò đặc biệt là niềm tự hào của quán 🤗' },
  { id: 'rv-4', customerName: 'Quang Huy', rating: 3, comment: 'Bún hơi nát, cần cải thiện. Nhưng nước dùng vẫn ok.', orderCode: 'QB-20260517-015', createdAt: '2026-05-17T11:30:00' },
  { id: 'rv-5', customerName: 'Đức Trung', rating: 4, comment: 'Giò heo hầm mềm, rất ngon. Sẽ đặt lại.', orderCode: 'QB-20260516-030', createdAt: '2026-05-16T19:45:00' },
  { id: 'rv-6', customerName: 'Minh Khoa', rating: 5, comment: 'Chất lượng ổn định, 10 điểm!', orderCode: 'QB-20260516-028', createdAt: '2026-05-16T13:00:00' },
  { id: 'rv-7', customerName: 'Thị Hương', rating: 2, comment: 'Đồ ăn nguội, giao chậm 30 phút.', orderCode: 'QB-20260515-012', createdAt: '2026-05-15T12:30:00' },
  { id: 'rv-8', customerName: 'Văn An', rating: 4, comment: 'Bánh bèo ngon, nước mắm chuẩn vị.', orderCode: 'QB-20260515-008', createdAt: '2026-05-15T10:00:00', reply: 'Cảm ơn bạn! Bánh bèo là món mới, rất vui khi bạn thích 😊' },
]

// ── Helpers ──
export const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ'

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  NEW:       { label: 'Đơn mới',       color: '#DC2626', bg: '#FEF2F2' },
  PREPARING: { label: 'Đang chuẩn bị', color: '#F59E0B', bg: '#FFFBEB' },
  READY:     { label: 'Sẵn sàng',      color: '#3B82F6', bg: '#EFF6FF' },
  COMPLETED: { label: 'Hoàn thành',    color: '#10B981', bg: '#ECFDF5' },
  CANCELLED: { label: 'Đã huỷ',        color: '#64748B', bg: '#F8FAFC' },
}
