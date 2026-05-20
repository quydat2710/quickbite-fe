import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, User, ChevronRight, UtensilsCrossed, Bike, ShieldCheck } from 'lucide-react'
import { useAuthStore, type UserRole } from '@/stores/authStore'
import api, { getErrorMessage } from '@/lib/api'

const ROLES = [
  { value: 'CUSTOMER' as UserRole, label: 'Khách hàng', desc: 'Đặt món ăn, giao tận nơi', icon: UtensilsCrossed, color: '#DC2626', bg: '#FEF2F2' },
  { value: 'RESTAURANT_OWNER' as UserRole, label: 'Chủ nhà hàng', desc: 'Quản lý nhà hàng, nhận đơn', icon: User, color: '#F59E0B', bg: '#FFFBEB' },
  { value: 'DRIVER' as UserRole, label: 'Tài xế', desc: 'Giao hàng, kiếm thu nhập', icon: Bike, color: '#3B82F6', bg: '#EFF6FF' },
]

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2>(1) // 1: info, 2: role

  const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/

  const handleSubmit = async () => {
    // Validate before submit
    const cleanPhone = phone.replace(/\s|-/g, '')
    if (!cleanPhone || !PHONE_RE.test(cleanPhone)) {
      setError('Số điện thoại không hợp lệ (VD: 0901234567)'); return
    }
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Họ tên phải có ít nhất 2 ký tự'); return
    }
    setError('')
    setIsLoading(true)

    try {
      const { data } = await api.patch('/users/me', {
        fullName,
        phone,
        role: selectedRole,
      })
      const updatedUser = data.data || data
      localStorage.setItem('qb_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      const redirectMap: Record<string, string> = {
        CUSTOMER: '/',
        RESTAURANT_OWNER: '/restaurant',
        DRIVER: '/driver',
        ADMIN: '/admin',
      }
      navigate(redirectMap[selectedRole] || '/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #FEF2F2 0%, #F5F5F7 50%, #EFF6FF 100%)',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '48px', margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>Hoàn thiện hồ sơ</h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Chỉ cần vài thông tin nữa để bắt đầu</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: s <= step ? 'linear-gradient(90deg, #DC2626, #EA580C)' : '#F1F5F9',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 20px 0' }}>Thông tin cá nhân</h2>

              {/* Google avatar + email */}
              {user?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEF2F2, #FFEDD5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#DC2626',
                  }}>
                    {(user.fullName || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{user.fullName || 'User'}</p>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{user.email}</p>
                  </div>
                  <ShieldCheck style={{ width: '18px', height: '18px', color: '#10B981', marginLeft: 'auto' }} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>Họ và tên</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94A3B8' }} />
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nguyễn Văn A"
                      style={{ width: '100%', height: '48px', paddingLeft: '44px', fontSize: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>Số điện thoại *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94A3B8' }} />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901234567" type="tel"
                      style={{ width: '100%', height: '48px', paddingLeft: '44px', fontSize: '15px', borderRadius: '12px', border: '1.5px solid #E5E7EB', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {step === 1 && error && (
                <p style={{ fontSize: '13px', color: '#DC2626', fontWeight: 500, margin: '12px 0 0 0', textAlign: 'center' }}>{error}</p>
              )}

              <button onClick={() => {
                const name = fullName.trim()
                if (!name || name.length < 2) { setError('Họ tên phải có ít nhất 2 ký tự'); return }
                const cleanPhone = phone.replace(/\s|-/g, '')
                if (!cleanPhone) { setError('Vui lòng nhập số điện thoại'); return }
                if (!PHONE_RE.test(cleanPhone)) { setError('SĐT không hợp lệ (VD: 0901234567)'); return }
                setError(''); setStep(2)
              }}
                style={{
                  width: '100%', height: '52px', borderRadius: '14px', border: 'none', cursor: 'pointer', marginTop: '24px',
                  background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
                  fontSize: '16px', fontWeight: 700, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(220,38,38,0.3)',
                }}>
                Tiếp tục <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>Bạn muốn sử dụng với vai trò?</h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>Bạn có thể thay đổi sau trong phần cài đặt</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {ROLES.map(r => (
                  <button key={r.value} onClick={() => setSelectedRole(r.value)} style={{
                    display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
                    borderRadius: '14px', border: `2px solid ${selectedRole === r.value ? r.color : '#F1F5F9'}`,
                    background: selectedRole === r.value ? r.bg : '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', background: r.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <r.icon style={{ width: '22px', height: '22px', color: r.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{r.label}</p>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>{r.desc}</p>
                    </div>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', marginLeft: 'auto', flexShrink: 0,
                      border: `2px solid ${selectedRole === r.value ? r.color : '#D1D5DB'}`,
                      background: selectedRole === r.value ? r.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selectedRole === r.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <p style={{ fontSize: '14px', color: '#DC2626', fontWeight: 500, margin: '0 0 16px 0', textAlign: 'center' }}>{error}</p>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, height: '52px', borderRadius: '14px', border: '1.5px solid #E2E8F0',
                  background: '#fff', color: '#64748B', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Quay lại
                </button>
                <button onClick={handleSubmit} disabled={isLoading} style={{
                  flex: 2, height: '52px', borderRadius: '14px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #DC2626, #EA580C)', color: '#fff',
                  fontSize: '16px', fontWeight: 700, fontFamily: 'inherit', opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 6px 20px rgba(220,38,38,0.3)',
                }}>
                  {isLoading ? 'Đang lưu...' : 'Hoàn tất'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
