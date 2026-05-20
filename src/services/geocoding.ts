/**
 * Geocoding service using Nominatim (OpenStreetMap)
 * Free, no API key required
 * Rate limit: 1 request/second — use with debounce
 */

export interface GeocodingResult {
  placeId: string
  displayName: string
  lat: number
  lng: number
  type: string
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'

/**
 * Search for addresses by text query (autocomplete)
 * Biased towards Vietnam for better local results
 */
export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return []

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '6',
      countrycodes: 'vn',
      'accept-language': 'vi',
    })

    const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { 'User-Agent': 'QuickBite-App/1.0' },
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.map((item: any) => ({
      placeId: String(item.place_id),
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type || 'unknown',
    }))
  } catch (err) {
    console.error('Geocoding search error:', err)
    return []
  }
}

/**
 * Reverse geocode: convert lat/lng to address text
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
      addressdetails: '1',
      'accept-language': 'vi',
    })

    const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
      headers: { 'User-Agent': 'QuickBite-App/1.0' },
    })

    if (!res.ok) return ''

    const data = await res.json()
    return data.display_name || ''
  } catch (err) {
    console.error('Reverse geocoding error:', err)
    return ''
  }
}

/**
 * Get current user position via browser Geolocation API
 */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Trình duyệt không hỗ trợ định vị'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('Bạn đã từ chối quyền truy cập vị trí'))
            break
          case err.POSITION_UNAVAILABLE:
            reject(new Error('Không thể xác định vị trí hiện tại'))
            break
          case err.TIMEOUT:
            reject(new Error('Hết thời gian xác định vị trí'))
            break
          default:
            reject(new Error('Lỗi không xác định khi lấy vị trí'))
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}
