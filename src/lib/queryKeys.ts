// ── React Query key factory ──
// Centralized query keys for consistent cache invalidation

export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Restaurants
  restaurants: {
    all: ['restaurants'] as const,
    list: (filters: Record<string, unknown>) => ['restaurants', 'list', filters] as const,
    detail: (id: string) => ['restaurants', 'detail', id] as const,
    menu: (id: string) => ['restaurants', 'menu', id] as const,
    reviews: (id: string) => ['restaurants', 'reviews', id] as const,
  },

  // Cart
  cart: {
    current: ['cart'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    list: (filters: Record<string, unknown>) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    restaurant: (restaurantId: string, filters?: Record<string, unknown>) =>
      ['orders', 'restaurant', restaurantId, filters] as const,
  },

  // Driver
  driver: {
    activeDelivery: ['driver', 'active-delivery'] as const,
    offers: ['driver', 'offers'] as const,
    history: (filters?: Record<string, unknown>) => ['driver', 'history', filters] as const,
    earnings: (period?: string) => ['driver', 'earnings', period] as const,
    stats: ['driver', 'stats'] as const,
  },
}
