// ── User API Service ──
import api from '@/lib/api'
import type { UserProfile, ApiResponse } from '@/types/api.types'

export const userApi = {
  /** Get current user profile */
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get('/users/me')
    const result = data as ApiResponse<UserProfile>
    return result.data
  },

  /** Update current user profile */
  async updateProfile(payload: {
    fullName?: string
    phone?: string
    email?: string
    avatarUrl?: string
  }): Promise<UserProfile> {
    const { data } = await api.patch('/users/me', payload)
    const result = data as ApiResponse<UserProfile>
    return result.data
  },

  /** Update avatar URL (after Cloudinary upload) */
  async updateAvatar(avatarUrl: string): Promise<UserProfile> {
    return this.updateProfile({ avatarUrl })
  },
}
