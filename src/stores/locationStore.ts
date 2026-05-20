import { create } from 'zustand'
import { reverseGeocode, getCurrentPosition } from '@/services/geocoding'

interface LocationState {
  /** Current display address (short form for header) */
  displayAddress: string
  /** Full address text */
  fullAddress: string
  /** Latitude */
  lat: number
  /** Longitude */
  lng: number
  /** Whether we're currently fetching location */
  isLoading: boolean
  /** Error message if location fetch failed */
  error: string | null
  /** Whether location has been successfully detected at least once */
  isDetected: boolean
  /** Detect current location via GPS + reverse geocode */
  detectCurrentLocation: () => Promise<void>
  /** Manually set location */
  setLocation: (data: { displayAddress: string; fullAddress: string; lat: number; lng: number }) => void
}

/**
 * Truncate a full Nominatim address to a short display form.
 * E.g. "227 Nguyễn Văn Cừ, Phường 4, Quận 5, Hồ Chí Minh, 70000, Việt Nam"
 * → "Nguyễn Văn Cừ, Quận 5"
 */
function shortenAddress(full: string): string {
  if (!full) return 'Chưa xác định'
  const parts = full.split(',').map(p => p.trim())
  // Take the first 2-3 meaningful parts
  const meaningful = parts.filter(p => {
    const lower = p.toLowerCase()
    // Filter out country, postal code, and very generic parts
    return !lower.includes('việt nam') &&
           !lower.includes('vietnam') &&
           !/^\d{5,}$/.test(p) && // postal codes
           p.length > 0
  })
  if (meaningful.length <= 2) return meaningful.join(', ')
  // Take first 2 parts for display
  return meaningful.slice(0, 2).join(', ')
}

export const useLocationStore = create<LocationState>((set, get) => ({
  displayAddress: 'Đang xác định...',
  fullAddress: '',
  lat: 10.762622,
  lng: 106.682514,
  isLoading: false,
  error: null,
  isDetected: false,

  detectCurrentLocation: async () => {
    // Don't detect again if already loading
    if (get().isLoading) return

    set({ isLoading: true, error: null })
    try {
      const pos = await getCurrentPosition()
      set({ lat: pos.lat, lng: pos.lng })

      const fullAddr = await reverseGeocode(pos.lat, pos.lng)
      const shortAddr = shortenAddress(fullAddr)

      set({
        displayAddress: shortAddr,
        fullAddress: fullAddr,
        lat: pos.lat,
        lng: pos.lng,
        isDetected: true,
        isLoading: false,
        error: null,
      })
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Không thể xác định vị trí',
        displayAddress: 'Chưa xác định',
      })
    }
  },

  setLocation: (data) => {
    set({
      displayAddress: data.displayAddress || shortenAddress(data.fullAddress),
      fullAddress: data.fullAddress,
      lat: data.lat,
      lng: data.lng,
      isDetected: true,
      error: null,
    })
  },
}))
