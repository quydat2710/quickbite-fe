// Mock data for development — will be replaced with API calls

export const mockRestaurants = [
  {
    id: '1',
    name: 'Bún Bò Huế 3 Đình',
    coverImage: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=380&fit=crop',
    rating: 4.8,
    totalOrders: 1250,
    categories: ['Bún', 'Món Huế'],
    distance: 1.2,
    deliveryTime: '20-30 phút',
    isOnline: true,
    description: 'Quán bún bò Huế truyền thống, nước dùng đậm đà, thịt bò tươi ngon mỗi ngày.',
    address: '45 Nguyễn Trãi, Q.5, TP.HCM',
    phone: '0901 234 567',
    openTime: '06:00',
    closeTime: '22:00',
  },
  {
    id: '2',
    name: 'Cơm Tấm Sài Gòn Ngon',
    coverImage: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=380&fit=crop',
    rating: 4.5,
    totalOrders: 890,
    categories: ['Cơm', 'Món Sài Gòn'],
    distance: 0.8,
    deliveryTime: '15-25 phút',
    isOnline: true,
    description: 'Cơm tấm sườn bì chả chuẩn vị Sài Gòn, phục vụ từ sáng sớm.',
    address: '123 Lê Lợi, Q.1, TP.HCM',
    phone: '0902 345 678',
    openTime: '05:30',
    closeTime: '21:00',
  },
  {
    id: '3',
    name: 'Pizza Express',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=380&fit=crop',
    rating: 4.3,
    totalOrders: 650,
    categories: ['Pizza', 'Đồ Tây'],
    distance: 2.5,
    deliveryTime: '30-45 phút',
    isOnline: true,
    description: 'Pizza kiểu Ý với đế mỏng giòn, phô mai kéo sợi.',
    address: '78 Hai Bà Trưng, Q.3, TP.HCM',
    phone: '0903 456 789',
    openTime: '10:00',
    closeTime: '23:00',
  },
  {
    id: '4',
    name: 'Phở Bà Chiểu',
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=380&fit=crop',
    rating: 4.7,
    totalOrders: 2100,
    categories: ['Phở', 'Món Bắc'],
    distance: 1.8,
    deliveryTime: '20-30 phút',
    isOnline: true,
    description: 'Phở bò truyền thống Hà Nội, nước dùng ninh xương 12 tiếng.',
    address: '256 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
    phone: '0904 567 890',
    openTime: '06:00',
    closeTime: '22:00',
  },
  {
    id: '5',
    name: 'Highlands Coffee',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=380&fit=crop',
    rating: 4.2,
    totalOrders: 3200,
    categories: ['Cà phê', 'Đồ uống'],
    distance: 0.5,
    deliveryTime: '10-20 phút',
    isOnline: true,
    description: 'Chuỗi cà phê Việt Nam với menu đa dạng từ cà phê đến trà.',
    address: '100 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '0905 678 901',
    openTime: '07:00',
    closeTime: '23:00',
  },
  {
    id: '6',
    name: 'Sushi Sakura Premium',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=380&fit=crop',
    rating: 4.6,
    totalOrders: 420,
    categories: ['Sushi', 'Đồ Nhật'],
    distance: 3.1,
    deliveryTime: '35-50 phút',
    isOnline: false,
    description: 'Sushi cao cấp với cá tươi nhập khẩu hàng ngày.',
    address: '55 Đồng Khởi, Q.1, TP.HCM',
    phone: '0906 789 012',
    openTime: '11:00',
    closeTime: '22:00',
  },
]

export type CategoryId =
  | 'com'
  | 'pho'
  | 'bun'
  | 'pizza'
  | 'coffee'
  | 'chicken'
  | 'sushi'
  | 'banhmi'
  | 'milktea'
  | 'dessert'
  | 'snack'
  | 'vegan'
  | 'burger'
  | 'seafood'
  | 'hotpot'
  | 'korean'

export const mockCategories: Array<{ id: CategoryId; name: string; keyword: string }> = [
  { id: 'com', name: 'Cơm', keyword: 'cơm' },
  { id: 'pho', name: 'Phở', keyword: 'phở' },
  { id: 'bun', name: 'Bún', keyword: 'bún' },
  { id: 'pizza', name: 'Pizza', keyword: 'pizza' },
  { id: 'coffee', name: 'Cà phê', keyword: 'cà phê' },
  { id: 'chicken', name: 'Gà rán', keyword: 'gà' },
  { id: 'sushi', name: 'Sushi', keyword: 'sushi' },
  { id: 'banhmi', name: 'Bánh mì', keyword: 'bánh mì' },
  { id: 'milktea', name: 'Trà sữa', keyword: 'trà sữa' },
  { id: 'dessert', name: 'Tráng miệng', keyword: 'tráng miệng' },
  { id: 'snack', name: 'Ăn vặt', keyword: 'ăn vặt' },
  { id: 'vegan', name: 'Món chay', keyword: 'chay' },
  { id: 'burger', name: 'Hamburger', keyword: 'burger' },
  { id: 'seafood', name: 'Hải sản', keyword: 'hải sản' },
  { id: 'hotpot', name: 'Lẩu', keyword: 'lẩu' },
  { id: 'korean', name: 'Món Hàn', keyword: 'hàn' },
]

export const mockFeaturedBrands = [
  {
    id: 'b1',
    name: 'Phúc Long',
    logo: 'https://play-lh.googleusercontent.com/XAjMGTVn_dZMJaVGQaYE-k1MZVhb2W-OHVnxd3UuGS0hyT-rFfGYyAlVpDLflsWYg=w240-h480-rw',
    promoTag: 'Giảm 30%',
    distance: '0.5 km',
  },
  {
    id: 'b2',
    name: 'Highlands',
    logo: 'https://play-lh.googleusercontent.com/a0MRLX9hWhKVFJhFjvFBkpHPMLXVJFzH-tReqMvGG_qKsJEPLSmDST-jO6CBdqpJyA=w240-h480-rw',
    promoTag: 'Freeship',
    distance: '0.8 km',
  },
  {
    id: 'b3',
    name: 'KFC',
    logo: 'https://play-lh.googleusercontent.com/UG_sx2wISO28P40Yk38W9GvDTK4SWJNHr6NvS3ykwLVX16WjR3MFCLDxGEQWFBHAK6A=w240-h480-rw',
    promoTag: 'Giảm 50%',
    distance: '1.2 km',
  },
  {
    id: 'b4',
    name: "McDonald's",
    logo: 'https://play-lh.googleusercontent.com/dIRwkMEUi1KnOj-NKH9AkX6U0_bOHdPbJuX5xPEF-4P3uUvXaJDMcmhJyRDYxBjp7w=w240-h480-rw',
    promoTag: 'Combo 99K',
    distance: '1.5 km',
  },
  {
    id: 'b5',
    name: 'Jollibee',
    logo: 'https://play-lh.googleusercontent.com/MhfsvDW-PXHfOkprRjpV7jvb8EZbLs0DsxJvFBHQiB8TLrd-yTu4WlSE-dv6_VVWBac=w240-h480-rw',
    promoTag: 'Giảm 25%',
    distance: '2.0 km',
  },
  {
    id: 'b6',
    name: 'Pizza Hut',
    logo: 'https://play-lh.googleusercontent.com/7JJkIh_lwEqQfAKVbN3fXZH7ARwNFGXYYIW85YCWuNIqHzRUKiU-kLR-6BGUU-Qj2g=w240-h480-rw',
    promoTag: 'Mua 1 tặng 1',
    distance: '2.3 km',
  },
  {
    id: 'b7',
    name: 'Lotteria',
    logo: 'https://play-lh.googleusercontent.com/7dZJXBHmjNcfyyjRNhpawAGhmSD2IJDjJCjaQyD2s5vWE4eAy7AUHKJnj3k3JGYtpg=w240-h480-rw',
    promoTag: 'Freeship',
    distance: '1.8 km',
  },
  {
    id: 'b8',
    name: 'Gong Cha',
    logo: 'https://play-lh.googleusercontent.com/IHzAvYR8y1VKh1EMrt0IlGv77q5Lb0DKPBWf33Mfqd9ZZWT37VNuKIhIJG9Qw2P0hQ=w240-h480-rw',
    promoTag: 'Giảm 20%',
    distance: '0.9 km',
  },
]

// ── Menu Items ──
export interface MenuItemOption {
  id: string
  name: string
  extraPrice: number
}

export interface MenuItemOptionGroup {
  id: string
  name: string
  required: boolean
  maxSelect: number
  options: MenuItemOption[]
}

export interface MenuItem {
  id: string
  categoryName: string
  name: string
  description: string
  basePrice: number
  image: string
  isAvailable: boolean
  optionGroups: MenuItemOptionGroup[]
  totalSold: number
}

export const mockMenuItems: Record<string, MenuItem[]> = {
  '1': [
    {
      id: 'm1',
      categoryName: 'Bún bò',
      name: 'Bún Bò Huế Đặc Biệt',
      description: 'Bún bò với đầy đủ thịt bò, giò heo, huyết, chả cua',
      basePrice: 65000,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 520,
      optionGroups: [
        {
          id: 'og1', name: 'Chọn size', required: true, maxSelect: 1,
          options: [
            { id: 'o1', name: 'Nhỏ', extraPrice: 0 },
            { id: 'o2', name: 'Vừa', extraPrice: 10000 },
            { id: 'o3', name: 'Lớn', extraPrice: 20000 },
          ],
        },
        {
          id: 'og2', name: 'Topping thêm', required: false, maxSelect: 3,
          options: [
            { id: 'o4', name: 'Thêm huyết', extraPrice: 5000 },
            { id: 'o5', name: 'Thêm chả cua', extraPrice: 10000 },
            { id: 'o6', name: 'Thêm giò heo', extraPrice: 15000 },
          ],
        },
      ],
    },
    {
      id: 'm2',
      categoryName: 'Bún bò',
      name: 'Bún Bò Giò Heo',
      description: 'Bún bò với giò heo hầm mềm',
      basePrice: 55000,
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 340,
      optionGroups: [
        {
          id: 'og1', name: 'Chọn size', required: true, maxSelect: 1,
          options: [
            { id: 'o1', name: 'Nhỏ', extraPrice: 0 },
            { id: 'o2', name: 'Lớn', extraPrice: 15000 },
          ],
        },
      ],
    },
    {
      id: 'm3',
      categoryName: 'Đồ uống',
      name: 'Trà Đá',
      description: 'Trà đá mát lạnh',
      basePrice: 5000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 890,
      optionGroups: [],
    },
    {
      id: 'm4',
      categoryName: 'Đồ uống',
      name: 'Nước Mía',
      description: 'Nước mía tươi nguyên chất',
      basePrice: 15000,
      image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 230,
      optionGroups: [],
    },
    {
      id: 'm5',
      categoryName: 'Món thêm',
      name: 'Chả Cua Chiên',
      description: 'Chả cua giòn rụm, ăn kèm rau sống',
      basePrice: 25000,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=300&h=300&fit=crop',
      isAvailable: false,
      totalSold: 120,
      optionGroups: [],
    },
  ],
  '2': [
    {
      id: 'm6',
      categoryName: 'Cơm tấm',
      name: 'Cơm Tấm Sườn Bì Chả',
      description: 'Cơm tấm đầy đủ sườn nướng, bì, chả trứng',
      basePrice: 50000,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 680,
      optionGroups: [
        {
          id: 'og3', name: 'Thêm topping', required: false, maxSelect: 2,
          options: [
            { id: 'o7', name: 'Thêm sườn', extraPrice: 20000 },
            { id: 'o8', name: 'Thêm trứng ốp la', extraPrice: 8000 },
          ],
        },
      ],
    },
    {
      id: 'm7',
      categoryName: 'Cơm tấm',
      name: 'Cơm Tấm Sườn Nướng',
      description: 'Cơm tấm với sườn nướng mềm thơm',
      basePrice: 40000,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop',
      isAvailable: true,
      totalSold: 450,
      optionGroups: [],
    },
  ],
}

// ── Reviews ──
export interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
  reply?: string
}

export const mockReviews: Record<string, Review[]> = {
  '1': [
    { id: 'r1', customerName: 'Minh Anh', rating: 5, comment: 'Bún bò rất ngon, nước dùng đậm đà. Sẽ quay lại!', createdAt: '2026-05-14' },
    { id: 'r2', customerName: 'Hoàng Việt', rating: 4, comment: 'Giao hàng nhanh, đồ ăn còn nóng hổi.', createdAt: '2026-05-13', reply: 'Cảm ơn bạn đã ủng hộ!' },
    { id: 'r3', customerName: 'Thu Hà', rating: 5, comment: 'Chả cua ngon lắm ạ, phần ăn nhiều.', createdAt: '2026-05-12' },
  ],
  '2': [
    { id: 'r4', customerName: 'Văn Đức', rating: 4, comment: 'Cơm tấm ngon, sườn nướng thơm.', createdAt: '2026-05-15' },
  ],
}

// ── Orders ──
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
