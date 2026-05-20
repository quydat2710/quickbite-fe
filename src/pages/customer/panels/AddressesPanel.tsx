import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { MapPin, Plus, X, Loader2, Navigation, Search } from 'lucide-react'
import { useLocationStore } from '@/stores/locationStore'
import api from '@/lib/api'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { searchAddress, reverseGeocode, getCurrentPosition, type GeocodingResult } from '@/services/geocoding'

/* ─── Fix Leaflet default marker icon ─── */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

/* ─── Map Constants ─── */
const DEFAULT_CENTER: [number, number] = [10.762622, 106.682514] // HCM City
const DEFAULT_ZOOM = 15

/* ─── Leaflet Map Helpers ─── */
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true })
  }, [lat, lng, map])
  return null
}

/* ─── Address Modal ─── */
function AddressModal({ initial, onClose, onSave }: {
  initial?: any; onClose: () => void; onSave: (data: any) => void
}) {
  // Pre-fill with user's current GPS location when adding new address
  const currentLocation = useLocationStore()
  const initLat = initial?.latitude || (currentLocation.isDetected ? currentLocation.lat : DEFAULT_CENTER[0])
  const initLng = initial?.longitude || (currentLocation.isDetected ? currentLocation.lng : DEFAULT_CENTER[1])
  const initAddress = initial?.address || (currentLocation.isDetected ? currentLocation.fullAddress : '')

  const [label, setLabel] = useState(initial?.label || '')
  const [address, setAddress] = useState(initAddress)
  const [lat, setLat] = useState<number>(initLat)
  const [lng, setLng] = useState<number>(initLng)
  const [isSaving, setIsSaving] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isReversing, setIsReversing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [geoError, setGeoError] = useState('')
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setGeoError('')
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchAddress(value)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 600) // 600ms debounce to respect Nominatim rate limit
  }, [])

  // Select suggestion
  const handleSelectSuggestion = (result: GeocodingResult) => {
    setAddress(result.displayName)
    setLat(result.lat)
    setLng(result.lng)
    setSearchQuery(result.displayName)
    setShowSuggestions(false)
    setSuggestions([])
  }

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLocating(true)
    setGeoError('')
    try {
      const pos = await getCurrentPosition()
      setLat(pos.lat)
      setLng(pos.lng)
      // Reverse geocode to get address text
      setIsReversing(true)
      const addrText = await reverseGeocode(pos.lat, pos.lng)
      if (addrText) {
        setAddress(addrText)
        setSearchQuery(addrText)
      }
    } catch (err: any) {
      setGeoError(err.message || 'Không thể lấy vị trí')
    } finally {
      setIsLocating(false)
      setIsReversing(false)
    }
  }

  // Handle map click / marker drag
  const handleLocationSelect = async (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    setIsReversing(true)
    try {
      const addrText = await reverseGeocode(newLat, newLng)
      if (addrText) {
        setAddress(addrText)
        setSearchQuery(addrText)
      }
    } catch {
      // silent fail
    } finally {
      setIsReversing(false)
    }
  }

  const handleSubmit = async () => {
    if (!label.trim() || !address.trim()) return
    setIsSaving(true)
    try {
      await onSave({ label: label.trim(), address: address.trim(), latitude: lat, longitude: lng })
    } finally { setIsSaving(false) }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.parentElement?.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markerPosition = useMemo((): [number, number] => [lat, lng], [lat, lng])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)', padding: '16px' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{initial ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex' }}><X style={{ width: '20px', height: '20px' }} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Label */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Nhãn (VD: Nhà, Cơ quan)</label>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Nhập nhãn..." autoFocus
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }} />
          </div>

          {/* Search + GPS row */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Tìm kiếm địa chỉ</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Search input with suggestions */}
              <div style={{ flex: 1, position: 'relative' }} ref={searchInputRef as any}>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                  <input
                    value={searchQuery}
                    onChange={e => handleSearchChange(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Gõ tên đường, quận, thành phố..."
                    style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box' }}
                  />
                  {isSearching && (
                    <Loader2 style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#DC2626', animation: 'spin 1s linear infinite' }} />
                  )}
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                    background: '#fff', borderRadius: '12px', marginTop: '4px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid #E2E8F0',
                    maxHeight: '200px', overflowY: 'auto',
                  }}>
                    {suggestions.map((s) => (
                      <button
                        key={s.placeId}
                        onClick={() => handleSelectSuggestion(s)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '10px 14px',
                          background: 'none', border: 'none', borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
                          color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '8px',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <MapPin style={{ width: '14px', height: '14px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ lineHeight: '1.4' }}>{s.displayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* GPS button */}
              <button
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                title="Dùng vị trí hiện tại"
                style={{
                  padding: '12px', borderRadius: '10px', border: '1.5px solid #E2E8F0',
                  background: isLocating ? '#FEF2F2' : '#fff', cursor: isLocating ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {isLocating ? (
                  <Loader2 style={{ width: '18px', height: '18px', color: '#DC2626', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Navigation style={{ width: '18px', height: '18px', color: '#DC2626' }} />
                )}
              </button>
            </div>
            {geoError && <p style={{ fontSize: '12px', color: '#EF4444', margin: '6px 0 0', fontWeight: 500 }}>{geoError}</p>}
          </div>

          {/* Mini Map */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #E2E8F0', height: '220px', position: 'relative' }}>
            {isReversing && (
              <div style={{
                position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, background: '#fff', padding: '6px 14px', borderRadius: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#475569', fontWeight: 500,
              }}>
                <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
                Đang xác định địa chỉ...
              </div>
            )}
            <MapContainer
              center={markerPosition}
              zoom={DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={markerPosition} />
              <MapClickHandler onLocationSelect={handleLocationSelect} />
              <MapRecenter lat={lat} lng={lng} />
            </MapContainer>
            <p style={{
              position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
              zIndex: 1000, background: 'rgba(255,255,255,0.92)', padding: '4px 12px', borderRadius: '8px',
              fontSize: '11px', color: '#64748B', margin: 0, whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>
              👆 Nhấn vào bản đồ để chọn vị trí
            </p>
          </div>

          {/* Address display */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Địa chỉ đầy đủ</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Địa chỉ sẽ tự động điền khi chọn trên bản đồ hoặc tìm kiếm..."
              rows={2}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC', boxSizing: 'border-box', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <MapPin style={{ width: '12px', height: '12px', color: '#94A3B8' }} />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Toạ độ: {lat.toFixed(6)}, {lng.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Huỷ</button>
          <button onClick={handleSubmit} disabled={isSaving || !label.trim() || !address.trim()} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#DC2626,#EA580C)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: (!label.trim() || !address.trim() || isSaving) ? 0.5 : 1 }}>
            {isSaving ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Addresses Panel ─── */
export function AddressesPanel() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editAddr, setEditAddr] = useState<any>(null)

  const loadAddresses = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/users/me/addresses')
      setAddresses(data.data || [])
    } catch {
      setAddresses([])
    } finally { setIsLoading(false) }
  }

  useEffect(() => { loadAddresses() }, [])

  const handleSave = async (data: any) => {
    try {
      if (editAddr) {
        await api.patch(`/users/me/addresses/${editAddr.id}`, data)
      } else {
        await api.post('/users/me/addresses', data)
      }
      setShowModal(false)
      setEditAddr(null)
      await loadAddresses()
    } catch (err) {
      console.error('Failed to save address:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn muốn xoá địa chỉ này?')) return
    try {
      await api.delete(`/users/me/addresses/${id}`)
      await loadAddresses()
    } catch (err) {
      console.error('Failed to delete address:', err)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        <Loader2 style={{ width: '28px', height: '28px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Cập nhật địa chỉ</h2>
        <button onClick={() => { setEditAddr(null); setShowModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus style={{ width: '14px', height: '14px' }} /> Thêm địa chỉ
        </button>
      </div>
      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
          <MapPin style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Chưa có địa chỉ nào</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {addresses.map((a: any) => (
            <div key={a.id} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: '#DC2626' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{a.label}</span>
                  {a.isDefault && <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>Mặc định</span>}
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{a.address}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                <button onClick={() => { setEditAddr(a); setShowModal(true) }} style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Sửa</button>
                <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: '#EF4444', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Xoá</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && <AddressModal initial={editAddr} onClose={() => { setShowModal(false); setEditAddr(null) }} onSave={handleSave} />}
    </div>
  )
}
