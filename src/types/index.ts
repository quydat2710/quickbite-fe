// ── Barrel export for all shared types ──
export type { Restaurant, MenuItem, FeaturedBrand } from './restaurant'
export type { Order, OrderItem, OrderStatus } from './order'
export type { PaginatedResponse, ApiError } from './common'

// Re-export store types for convenience
export type { User } from '@/stores/authStore'
export type { CartItem, CartItemOption } from '@/stores/cartStore'
