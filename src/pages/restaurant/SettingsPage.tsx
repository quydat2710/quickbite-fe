import { useState, useEffect } from 'react'
import {
  Store, MapPin, Phone, Clock, Power, Image, Save,
  Edit3, Mail, Loader2, Upload,
} from 'lucide-react'
import { restaurantOwnerApi } from '@/services/api'
import { uploadToCloudinary } from '@/lib/cloudinary'

export default function RestaurantSettingsPage() {
  const [info, setInfo] = useState<any>(null)
  const [restaurantId, setRestaurantId] = useState('')
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    restaurantOwnerApi.getMyRestaurants()
      .then(res => {
        if (res.length > 0) {
          setInfo(res[0])
          setRestaurantId(res[0].id)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = async () => {
    if (!restaurantId) return
    try {
      await restaurantOwnerApi.updateRestaurant(restaurantId, {
        name: info.name,
        address: info.address,
        phone: info.phone,
        description: info.description,
        openTime: info.openTime,
        closeTime: info.closeTime,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const handleToggleOnline = async () => {
    if (!restaurantId) return
    try {
      const result = await restaurantOwnerApi.toggleOnline(restaurantId)
      setInfo((prev: any) => ({ ...prev, isOnline: result.isOnline }))
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  if (isLoading || !info) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: '#DC2626' }} />
      </div>
    )
  }

  const Field = ({ label, icon: Icon, value, field, type = 'text' }: {
    label: string; icon: React.ElementType; value: string; field: string; type?: string
  }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', width: '140px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon style={{ width: '16px', height: '16px', color: '#94A3B8' }} />
        {label}
      </label>
      <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
        <input
          value={value}
          onChange={e => setInfo({ ...info, [field]: e.target.value })}
          type={type}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', color: '#0F172A', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Online/Offline toggle ── */}
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Trạng thái nhà hàng</h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {info.isOnline ? 'Nhà hàng đang hiển thị và nhận đơn hàng' : 'Nhà hàng đang tắt, không nhận đơn mới'}
          </p>
        </div>
        <button
          onClick={() => handleToggleOnline()}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 28px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, transition: 'all 0.2s',
            background: info.isOnline ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: '#fff', boxShadow: info.isOnline ? '0 4px 16px rgba(16,185,129,0.35)' : '0 4px 16px rgba(239,68,68,0.35)',
          }}
        >
          <Power style={{ width: '20px', height: '20px' }} />
          {info.isOnline ? 'Đang mở bán' : 'Đã đóng cửa'}
        </button>
      </div>

      {/* ── Cover image ── */}
      <div style={{
        background: '#fff', borderRadius: '16px', overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.02)',
      }}>
        <div style={{ position: 'relative', height: '200px' }}>
          {info.coverImage ? (
            <img src={info.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image style={{ width: '48px', height: '48px', color: '#CBD5E1' }} />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
          <label style={{
            position: 'absolute', bottom: '16px', right: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '10px', border: 'none',
            background: 'rgba(255,255,255,0.95)', color: '#0F172A',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <Upload style={{ width: '16px', height: '16px' }} />
            Đổi ảnh bìa
            <input type="file" accept="image/*" hidden onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const result = await uploadToCloudinary(file, 'quickbite/restaurants')
                setInfo((prev: any) => ({ ...prev, coverImage: result.secure_url }))
                if (restaurantId) {
                  await restaurantOwnerApi.updateRestaurant(restaurantId, { coverImage: result.secure_url })
                }
              } catch (err) {
                console.error('Upload failed:', err)
              }
            }} />
          </label>
        </div>

        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 20px 0' }}>Thông tin nhà hàng</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Tên nhà hàng" icon={Store} value={info.name} field="name" />
            <Field label="Địa chỉ" icon={MapPin} value={info.address} field="address" />
            <Field label="Số điện thoại" icon={Phone} value={info.phone} field="phone" type="tel" />

            {/* Description (textarea) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', width: '140px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px' }}>
                <Edit3 style={{ width: '16px', height: '16px', color: '#94A3B8' }} /> Mô tả
              </label>
              <textarea
                value={info.description}
                onChange={e => setInfo({ ...info, description: e.target.value })}
                rows={3}
                style={{ flex: 1, minWidth: '220px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', color: '#0F172A', background: '#F8FAFC', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Opening hours */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569', width: '140px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '16px', height: '16px', color: '#94A3B8' }} /> Giờ mở cửa
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="time" value={info.openTime}
                  onChange={e => setInfo({ ...info, openTime: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', color: '#0F172A', background: '#F8FAFC', outline: 'none' }}
                />
                <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>—</span>
                <input
                  type="time" value={info.closeTime}
                  onChange={e => setInfo({ ...info, closeTime: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', fontFamily: 'inherit', color: '#0F172A', background: '#F8FAFC', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 32px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
              fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(220,38,38,0.3)',
            }}>
              <Save style={{ width: '18px', height: '18px' }} />
              Lưu thay đổi
            </button>
            {saved && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#10B981', animation: 'fadeIn 0.3s' }}>
                ✓ Đã lưu thành công!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
