// ── Order domain types ──
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  unitPrice: number
  options: string[]
}

export interface Order {
  id: string
  restaurantId: string
  restaurantName: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  estimatedDelivery: string
}
