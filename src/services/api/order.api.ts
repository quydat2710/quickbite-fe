// ── Order API Service ──
import api from '@/lib/api'
import type { Order, PaginatedResponse, ApiResponse } from '@/types/api.types'

export interface CreateOrderPayload {
  restaurantId: string
  items: {
    menuItemId: string
    name: string
    unitPrice: number
    quantity: number
    options: { groupId: string; groupName: string; optionId: string; optionName: string; extraPrice: number }[]
    notes?: string
    imageUrl?: string | null
  }[]
  deliveryAddress: string
  note?: string
  paymentMethod?: string
}

export const orderApi = {
  /** Create order from cart */
  async create(payload: CreateOrderPayload): Promise<{ order: Order; payment: any }> {
    const { data } = await api.post('/orders', payload)
    const result = data as ApiResponse<{ order: Order; payment: any }>
    return result.data
  },

  /** List my orders with pagination */
  async list(page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get('/orders', {
      params: { page, limit, ...(status && { status }) },
    })
    return data
  },

  /** Get order detail */
  async getById(orderId: string): Promise<Order> {
    const { data } = await api.get(`/orders/${orderId}`)
    const result = data as ApiResponse<Order>
    return result.data
  },

  /** Cancel an order */
  async cancel(orderId: string, reason: string): Promise<Order> {
    const { data } = await api.post(`/orders/${orderId}/cancel`, { reason })
    const result = data as ApiResponse<Order>
    return result.data
  },

  /** Update order status (for restaurant owner / driver) */
  async updateStatus(orderId: string, status: string): Promise<Order> {
    const { data } = await api.put(`/orders/${orderId}/status`, { status })
    const result = data as ApiResponse<Order>
    return result.data
  },
}
