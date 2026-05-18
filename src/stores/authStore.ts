import { create } from 'zustand'

// ── Types ──
export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  avatarUrl: string | null
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DRIVER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

// ── Store ──
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false })
  },
}))
