import { create } from 'zustand'

// ── Types ──
export interface CartItemOption {
  groupId: string
  groupName: string
  optionId: string
  optionName: string
  extraPrice: number
}

export interface CartItem {
  menuItemId: string
  name: string
  unitPrice: number
  quantity: number
  options: CartItemOption[]
  notes: string
  imageUrl: string | null
}

interface CartState {
  restaurantId: string | null
  restaurantName: string | null
  items: CartItem[]
  addItem: (restaurantId: string, restaurantName: string, item: CartItem) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  removeItem: (menuItemId: string) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

// ── Store ──
export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: null,
  items: [],

  addItem: (restaurantId, restaurantName, item) => {
    const state = get()

    // If switching restaurant, clear cart first
    if (state.restaurantId && state.restaurantId !== restaurantId) {
      set({ restaurantId, restaurantName, items: [item] })
      return
    }

    const existingIndex = state.items.findIndex(
      (i) => i.menuItemId === item.menuItemId
    )

    if (existingIndex >= 0) {
      const newItems = [...state.items]
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + item.quantity,
      }
      set({ restaurantId, restaurantName, items: newItems })
    } else {
      set({ restaurantId, restaurantName, items: [...state.items, item] })
    }
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId)
      return
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      ),
    }))
  },

  removeItem: (menuItemId) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.menuItemId !== menuItemId)
      if (newItems.length === 0) {
        return { items: [], restaurantId: null, restaurantName: null }
      }
      return { items: newItems }
    })
  },

  clearCart: () =>
    set({ items: [], restaurantId: null, restaurantName: null }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const optionsExtra = item.options.reduce(
        (sum, opt) => sum + opt.extraPrice,
        0
      )
      return total + (item.unitPrice + optionsExtra) * item.quantity
    }, 0)
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))
