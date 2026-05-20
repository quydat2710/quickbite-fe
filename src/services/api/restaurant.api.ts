// ── Restaurant API Service ──
import api from '@/lib/api'
import type { Restaurant, MenuItem, Review, PaginatedResponse, ApiResponse } from '@/types/api.types'

export interface SearchParams {
  keyword?: string
  category?: string
  lat?: number
  lng?: number
  radius?: number
  page?: number
  limit?: number
}

export const restaurantApi = {
  /** Search / list restaurants */
  async search(params: SearchParams = {}): Promise<PaginatedResponse<Restaurant>> {
    const { data } = await api.get('/restaurants', { params })
    return data
  },

  /** Get restaurant detail by ID */
  async getById(id: string): Promise<Restaurant> {
    const { data } = await api.get(`/restaurants/${id}`)
    const result = data as ApiResponse<Restaurant>
    return result.data
  },

  /** Get menu items for a restaurant */
  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    const { data } = await api.get(`/restaurants/${restaurantId}/menu`)
    const result = data as ApiResponse<MenuItem[]>
    return result.data || []
  },

  /** Get reviews for a restaurant */
  async getReviews(restaurantId: string, page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    const { data } = await api.get(`/restaurants/${restaurantId}/reviews`, {
      params: { page, limit },
    })
    return data
  },

  /** Create a review */
  async createReview(restaurantId: string, body: { rating: number; comment: string }): Promise<Review> {
    const { data } = await api.post(`/restaurants/${restaurantId}/reviews`, body)
    const result = data as ApiResponse<Review>
    return result.data
  },
}
