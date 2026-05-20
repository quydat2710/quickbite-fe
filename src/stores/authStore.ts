import { create } from 'zustand'
import api, { getErrorMessage } from '@/lib/api'

// ── Types ──
export type UserRole = 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DRIVER' | 'ADMIN'

export interface User {
  id: string
  fullName: string
  email?: string
  phone: string
  avatarUrl?: string | null
  role: UserRole
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (phone: string, password: string) => Promise<{ role: UserRole }>
  register: (data: { fullName: string; phone: string; email?: string; password: string; role?: string }) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  loadFromStorage: () => void

  // Role helpers
  isCustomer: () => boolean
  isRestaurantOwner: () => boolean
  isDriver: () => boolean
  isAdmin: () => boolean
}

// ── Store ──
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (phone, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { phone, password })
      const result = data.data || data

      const user: User = result.user
      const accessToken = result.accessToken
      const refreshToken = result.refreshToken

      // Persist
      localStorage.setItem('qb_access_token', accessToken)
      localStorage.setItem('qb_refresh_token', refreshToken)
      localStorage.setItem('qb_user', JSON.stringify(user))

      set({ user, isAuthenticated: true, isLoading: false })
      return { role: user.role }
    } catch (error) {
      set({ isLoading: false })
      throw error // re-throw original so callers can inspect response.status
    }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      const role = data.role || 'CUSTOMER'
      const endpoint = role === 'RESTAURANT_OWNER'
        ? '/auth/register/restaurant'
        : role === 'DRIVER'
          ? '/auth/register/driver'
          : '/auth/register/customer'

      await api.post(endpoint, {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      })
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error // re-throw original
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors — clear local state regardless
    }
    localStorage.removeItem('qb_access_token')
    localStorage.removeItem('qb_refresh_token')
    localStorage.removeItem('qb_user')
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('qb_user')
      const token = localStorage.getItem('qb_access_token')
      if (stored && token) {
        const user = JSON.parse(stored) as User
        set({ user, isAuthenticated: true })
      }
    } catch {
      // Corrupted data — clear
      localStorage.removeItem('qb_user')
    }
  },

  // Role helpers
  isCustomer: () => get().user?.role === 'CUSTOMER',
  isRestaurantOwner: () => get().user?.role === 'RESTAURANT_OWNER',
  isDriver: () => get().user?.role === 'DRIVER',
  isAdmin: () => get().user?.role === 'ADMIN',
}))
