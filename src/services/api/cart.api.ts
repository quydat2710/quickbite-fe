// ── Cart API Service ──
import api from '@/lib/api'
import type { CartBE, ApiResponse } from '@/types/api.types'

export const cartApi = {
  /** Get current cart from server */
  async get(): Promise<CartBE | null> {
    const { data } = await api.get('/cart')
    const result = data as ApiResponse<CartBE | null>
    return result.data
  },

  /** Add item to server cart */
  async addItem(item: {
    menuItemId: string
    restaurantId: string
    restaurantName: string
    name: string
    unitPrice: number
    quantity: number
    options: { groupId: string; groupName: string; optionId: string; optionName: string; extraPrice: number }[]
    notes?: string
    imageUrl?: string | null
  }): Promise<CartBE> {
    const { data } = await api.post('/cart/items', item)
    const result = data as ApiResponse<CartBE>
    return result.data
  },

  /** Update cart item quantity by index */
  async updateItem(index: number, quantity: number): Promise<CartBE> {
    const { data } = await api.put(`/cart/items/${index}`, { quantity })
    const result = data as ApiResponse<CartBE>
    return result.data
  },

  /** Remove cart item by index */
  async removeItem(index: number): Promise<CartBE> {
    const { data } = await api.delete(`/cart/items/${index}`)
    const result = data as ApiResponse<CartBE>
    return result.data
  },

  /** Clear entire cart */
  async clear(): Promise<void> {
    await api.delete('/cart')
  },
}
