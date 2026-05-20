// ── Shared API Types for QuickBite ──

// ── Generic API response wrapper ──
export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ── Restaurant ──
export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  coverImage: string | null
  logoImage: string | null
  category: string
  tags: string[]
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  isOnline: boolean
  openTime: string
  closeTime: string
  latitude: number | null
  longitude: number | null
  ownerId: string
  createdAt: string
}

// ── Menu ──
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
  name: string
  description: string
  basePrice: number
  image: string | null
  categoryName: string
  isAvailable: boolean
  optionGroups: MenuItemOptionGroup[]
}

// ── Review ──
export interface Review {
  id: string
  customerId: string
  customerName: string
  rating: number
  comment: string
  reply?: string
  createdAt: string
}

// ── Order ──
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderItem {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  options: { groupName: string; optionName: string; extraPrice: number }[]
  notes?: string
  imageUrl?: string | null
}

export interface Order {
  id: string
  restaurantId: string
  restaurantName: string
  customerId: string
  driverId?: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  status: OrderStatus
  paymentMethod: string
  deliveryAddress: string
  note?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

// ── Cart (BE) ──
export interface CartItemBE {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  options: { groupId: string; groupName: string; optionId: string; optionName: string; extraPrice: number }[]
  notes: string
  imageUrl: string | null
}

export interface CartBE {
  restaurantId: string
  restaurantName: string
  items: CartItemBE[]
}

// ── User ──
export interface UserProfile {
  id: string
  fullName: string
  phone: string
  email?: string
  avatarUrl?: string | null
  role: string
  status: string
  createdAt: string
}
