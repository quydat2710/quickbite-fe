// ── Restaurant domain types ──
export interface Restaurant {
  id: string
  name: string
  coverImage: string
  rating: number
  totalOrders: number
  categories: string[]
  distance: number
  deliveryTime: string
  isOnline?: boolean
  description: string
  address: string
  phone: string
  openTime: string
  closeTime: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isPopular?: boolean
  isAvailable?: boolean
}

export interface FeaturedBrand {
  id: string
  name: string
  logo: string
  promoTag: string
  distance: string
}
