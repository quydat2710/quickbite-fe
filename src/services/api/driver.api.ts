// ── Driver API Service ──
import api from '@/lib/api'
import type { Order, PaginatedResponse, ApiResponse } from '@/types/api.types'

export interface DriverEarnings {
  totalDeliveries: number
  totalEarnings: number
  todayDeliveries: number
  todayEarnings: number
}

export const driverApi = {
  /** Get orders available for pickup */
  async getAvailableOrders(page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get('/driver/available-orders', { params: { page, limit } })
    return data
  },

  /** Get my active deliveries */
  async getMyDeliveries(): Promise<Order[]> {
    const { data } = await api.get('/driver/my-deliveries')
    const result = data as ApiResponse<Order[]>
    return result.data || []
  },

  /** Accept an order */
  async acceptOrder(orderId: string): Promise<Order> {
    const { data } = await api.post(`/driver/orders/${orderId}/accept`)
    const result = data as ApiResponse<Order>
    return result.data
  },

  /** Mark order as picked up */
  async pickupOrder(orderId: string): Promise<Order> {
    const { data } = await api.post(`/driver/orders/${orderId}/pickup`)
    const result = data as ApiResponse<Order>
    return result.data
  },

  /** Mark order as delivered */
  async deliverOrder(orderId: string): Promise<Order> {
    const { data } = await api.post(`/driver/orders/${orderId}/deliver`)
    const result = data as ApiResponse<Order>
    return result.data
  },

  /** Get delivery history */
  async getHistory(page = 1, limit = 20): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get('/driver/history', { params: { page, limit } })
    return data
  },

  /** Get earnings summary */
  async getEarnings(): Promise<DriverEarnings> {
    const { data } = await api.get('/driver/earnings')
    const result = data as ApiResponse<DriverEarnings>
    return result.data
  },
}
