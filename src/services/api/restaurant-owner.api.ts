// ── Restaurant Owner API Service ──
import api from '@/lib/api'
import type { Restaurant, MenuItem, Review, PaginatedResponse, ApiResponse } from '@/types/api.types'

export const restaurantOwnerApi = {
  /** Get restaurants owned by current user */
  async getMyRestaurants(): Promise<Restaurant[]> {
    const { data } = await api.get('/restaurants', { params: { limit: 50 } })
    const result = data as PaginatedResponse<Restaurant>
    return result.data || []
  },

  /** Update restaurant info */
  async updateRestaurant(id: string, payload: Partial<Restaurant>): Promise<Restaurant> {
    const { data } = await api.patch(`/restaurants/${id}`, payload)
    const result = data as ApiResponse<Restaurant>
    return result.data
  },

  /** Toggle online status */
  async toggleOnline(id: string): Promise<{ isOnline: boolean }> {
    const { data } = await api.patch(`/restaurants/${id}/toggle-online`)
    const result = data as ApiResponse<{ isOnline: boolean }>
    return result.data
  },

  /** Get menu (grouped by category) */
  async getMenu(restaurantId: string): Promise<any[]> {
    const { data } = await api.get(`/restaurants/${restaurantId}/menu`)
    const result = data as ApiResponse<any[]>
    return result.data || []
  },

  /** Create menu item */
  async createMenuItem(restaurantId: string, item: Partial<MenuItem>): Promise<MenuItem> {
    const { data } = await api.post(`/restaurants/${restaurantId}/items`, item)
    const result = data as ApiResponse<MenuItem>
    return result.data
  },

  /** Update menu item */
  async updateMenuItem(restaurantId: string, itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data } = await api.patch(`/restaurants/${restaurantId}/items/${itemId}`, updates)
    const result = data as ApiResponse<MenuItem>
    return result.data
  },

  /** Delete menu item */
  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    await api.delete(`/restaurants/${restaurantId}/items/${itemId}`)
  },

  /** Get restaurant orders */
  async getOrders(restaurantId: string, page = 1, limit = 20, status?: string): Promise<PaginatedResponse<any>> {
    const { data } = await api.get(`/restaurants/${restaurantId}/orders`, {
      params: { page, limit, ...(status && { status }) },
    })
    return data
  },

  /** Get restaurant reviews */
  async getReviews(restaurantId: string, page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    const { data } = await api.get(`/restaurants/${restaurantId}/reviews`, {
      params: { page, limit },
    })
    return data
  },

  /** Create restaurant */
  async createRestaurant(payload: Partial<Restaurant>): Promise<Restaurant> {
    const { data } = await api.post('/restaurants', payload)
    const result = data as ApiResponse<Restaurant>
    return result.data
  },
}
