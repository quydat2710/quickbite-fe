import { useState, useEffect } from 'react'
import { User, Edit3, Phone, Mail, Lock } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/services/api'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getErrorMessage } from '@/lib/api'

export function AccountPanel() {
  const { user, setUser } = useAuthStore()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Sync from store when user changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setAvatarUrl(user.avatarUrl || '')
    }
  }, [user])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ảnh tối đa 5 MB' })
      return
    }
    setIsUploading(true)
    setMessage(null)
    try {
      const result = await uploadToCloudinary(file, 'quickbite/avatars')
      setAvatarUrl(result.secure_url)
      // Save immediately
      const updated = await userApi.updateAvatar(result.secure_url)
      setUser({ ...user!, avatarUrl: result.secure_url })
      localStorage.setItem('qb_user', JSON.stringify({ ...user, avatarUrl: result.secure_url }))
      setMessage({ type: 'success', text: 'Cập nhật ảnh thành công!' })
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      const updated = await userApi.updateProfile({ fullName, email, phone })
      const newUser = { ...user!, fullName: updated.fullName || fullName, email: updated.email || email, phone: updated.phone || phone }
      setUser(newUser)
      localStorage.setItem('qb_user', JSON.stringify(newUser))
      setMessage({ type: 'success', text: 'Lưu thông tin thành công!' })
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 24px 0' }}>Thông tin người dùng</h2>

      {/* Avatar */}
      <section style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: '1px solid #F1F5F9' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#DC2626', margin: '0 0 16px 0' }}>Tải ảnh đại diện</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', flexShrink: 0, overflow: 'hidden' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User style={{ width: '32px', height: '32px', color: '#DC2626' }} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #DC2626', background: '#fff', color: '#DC2626', fontSize: '14px', fontWeight: 600, cursor: isUploading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: isUploading ? 0.6 : 1 }}>
                {isUploading ? 'Đang tải...' : 'Chọn ảnh'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden disabled={isUploading} />
              </label>
            </div>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>GIF, JPEG, PNG, BMP · Tối đa 5 MB</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#DC2626', margin: '0 0 16px 0' }}>Thay đổi thông tin</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Họ và tên', value: fullName, set: setFullName, type: 'text', icon: User },
            { label: 'Email', value: email, set: setEmail, type: 'email', icon: Mail },
            { label: 'Số điện thoại', value: phone, set: setPhone, type: 'tel', icon: Phone },
          ].map(({ label, value, set, type, icon: Icon }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', width: '120px', flexShrink: 0 }}>{label}</label>
              <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                <input value={value} onChange={(e) => set(e.target.value)} type={type}
                  style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '14px', color: '#0F172A', fontFamily: 'inherit', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }} />
                <Edit3 style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '13px', height: '13px', color: '#94A3B8' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', width: '120px', flexShrink: 0 }}>Mật khẩu</label>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
              <span style={{ fontSize: '14px', color: '#64748B', letterSpacing: '4px' }}>••••••••</span>
              <button style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock style={{ width: '12px', height: '12px' }} /> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        {message && (
          <p style={{ marginTop: '12px', fontSize: '13px', fontWeight: 600, color: message.type === 'success' ? '#10B981' : '#EF4444' }}>{message.text}</p>
        )}

        <button onClick={handleSave} disabled={isSaving}
          style={{ marginTop: '20px', padding: '12px 32px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(220,38,38,0.3)', opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </section>
    </div>
  )
}
