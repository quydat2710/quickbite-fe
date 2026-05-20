import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Gift, Shield, Zap, User, Phone, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
function FbLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// ── MUST be defined OUTSIDE the parent component to avoid remount on every render ──
function FieldWrapper({ label, icon: Icon, children, error }: {
  label: string; icon: React.ElementType; children: React.ReactNode; error?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: error ? '#EF4444' : '#94A3B8', pointerEvents: 'none', zIndex: 1 }} />
        {children}
      </div>
      {error && <p style={{ fontSize: '12px', color: '#EF4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
        <AlertCircle style={{ width: '12px', height: '12px' }} />{error}
      </p>}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore(s => s.register)
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = () => {
    const errs: Record<string, string> = {}
    // Full name
    const name = form.fullName.trim()
    if (!name) errs.fullName = 'Vui lòng nhập họ tên'
    else if (name.length < 2) errs.fullName = 'Họ tên phải có ít nhất 2 ký tự'

    // Phone (VN format)
    const phone = form.phone.replace(/\s|-/g, '')
    if (!phone) errs.phone = 'Nhập số điện thoại'
    else if (!PHONE_RE.test(phone)) errs.phone = 'SĐT không hợp lệ (VD: 0901234567)'

    // Email (optional but must be valid if entered)
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      errs.email = 'Email không hợp lệ'
    }

    // Password
    if (!form.password) errs.password = 'Nhập mật khẩu'
    else if (form.password.length < 6) errs.password = 'Tối thiểu 6 ký tự'
    else if (form.password.length > 128) errs.password = 'Tối đa 128 ký tự'

    // Confirm password
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    try {
      await register({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (err: any) {
      setErrors({ submit: err.message || 'Đăng ký thất bại' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/v1/auth/google'
  }

  const inputStyle = (field: string, hasError?: boolean): React.CSSProperties => ({
    width: '100%', height: '50px', paddingLeft: '46px', paddingRight: '16px',
    fontSize: '14px', borderRadius: '12px',
    border: `1.5px solid ${hasError ? '#EF4444' : focusedField === field ? '#DC2626' : '#E5E7EB'}`,
    background: hasError ? '#FEF2F2' : '#fff', outline: 'none',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: focusedField === field && !hasError ? '0 0 0 3px rgba(220,38,38,0.12)' : 'none',
    transition: 'all 0.2s', color: hasError ? '#DC2626' : '#0F172A', boxSizing: 'border-box',
  })


  const passwordStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['transparent', '#EF4444', '#F97316', '#16A34A']
  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Mạnh']

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F5F7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes authFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes authFadeRight { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes authFloatA { 0%,100% { transform:rotate(-6deg) translateY(0); } 50% { transform:rotate(-6deg) translateY(-12px); } }
        @keyframes authFloatB { 0%,100% { transform:rotate(8deg) translateY(0); } 50% { transform:rotate(8deg) translateY(-16px); } }
        @keyframes authFloatC { 0%,100% { transform:rotate(-3deg) translateY(0); } 50% { transform:rotate(-3deg) translateY(-10px); } }
        .auth-panel { animation: authFadeRight 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .auth-form  { animation: authFadeUp  0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .food-a { animation: authFloatA 4s ease-in-out infinite; }
        .food-b { animation: authFloatB 5s ease-in-out infinite 0.5s; }
        .food-c { animation: authFloatC 4.5s ease-in-out infinite 1s; }
        @media (max-width: 1023px) { .auth-desktop-panel { display:none!important; } }
        @media (min-width: 1024px) { .auth-mobile-header { display:none!important; } }
      `}</style>

      {/* ══ LEFT: Form ══ */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', overflowY: 'auto' }}>
        {/* Mobile gradient header */}
        <div className="auth-mobile-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(155deg, #7F1D1D, #DC2626, #EA580C)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="auth-form" style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1, paddingTop: '8px', paddingBottom: '8px' }}>
          {/* Mobile logo */}
          <div className="auth-mobile-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <NavLink to="/">
              <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '56px', width: 'auto', filter: 'brightness(0) invert(1)', margin: '0 auto 6px' }} />
            </NavLink>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500 }}>Đặt món ngon, giao tận nơi</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '24px', padding: '32px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '4px', letterSpacing: '-0.02em' }}>Tạo tài khoản mới</h1>
              <p style={{ fontSize: '14px', color: '#64748B' }}>Nhập thông tin để bắt đầu đặt món ngon</p>
            </div>

            {/* Social login */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button type="button" onClick={handleGoogleLogin} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                height: '46px', borderRadius: '12px', border: '1.5px solid #E5E7EB', width: '100%',
                background: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'Inter, system-ui, sans-serif', color: '#0F172A',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <GoogleLogo /> Tiếp tục với Google
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>hoặc</span>
              <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name */}
              <FieldWrapper label="Họ và tên" icon={User} error={errors.fullName}>
                <input type="text" placeholder="Nguyễn Văn A" value={form.fullName}
                  onChange={e => update('fullName', e.target.value)}
                  onFocus={() => setFocusedField('fullName')} onBlur={() => setFocusedField(null)}
                  style={inputStyle('fullName', !!errors.fullName)} />
              </FieldWrapper>

              {/* Phone + Email grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FieldWrapper label="Số điện thoại" icon={Phone} error={errors.phone}>
                  <input type="tel" placeholder="0901 234 567" value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                    style={inputStyle('phone', !!errors.phone)} />
                </FieldWrapper>
                <FieldWrapper label="Email" icon={Mail} error={errors.email}>
                  <input type="email" placeholder="email@example.com" value={form.email}
                    onChange={e => update('email', e.target.value)}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    style={inputStyle('email', !!errors.email)} />
                </FieldWrapper>
              </div>

              {/* Section divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield style={{ width: '12px', height: '12px' }} /> Bảo mật tài khoản
                </span>
                <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
              </div>

              {/* Password */}
              <FieldWrapper label="Mật khẩu" icon={Lock} error={errors.password}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự"
                  value={form.password} onChange={e => update('password', e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('password', !!errors.password), paddingRight: '46px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', display: 'flex' }}>
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </FieldWrapper>

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-8px' }}>
                  <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= passwordStrength ? strengthColors[passwordStrength] : '#E5E7EB', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: strengthColors[passwordStrength], minWidth: '60px', textAlign: 'right' }}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}

              {/* Confirm Password */}
              <FieldWrapper label="Xác nhận mật khẩu" icon={Lock} error={errors.confirmPassword}>
                <input type="password" placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle('confirmPassword', !!errors.confirmPassword), paddingRight: '46px' }} />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#16A34A' }} />
                )}
              </FieldWrapper>

              {/* Submit */}
              <button type="submit" disabled={isLoading} style={{
                width: '100%', height: '52px', borderRadius: '14px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '4px',
                background: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)',
                color: '#fff', fontSize: '15px', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif',
                boxShadow: '0 8px 24px rgba(220,38,38,0.35)', opacity: isLoading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.45)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.35)' }}
              >
                {isLoading ? 'Đang tạo tài khoản...' : <>Tạo tài khoản <ArrowRight style={{ width: '18px', height: '18px' }} /></>}
              </button>
            </form>

            {/* Submit error */}
            {errors.submit && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: '#FEF2F2', marginTop: '12px' }}>
                <AlertCircle style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: 500 }}>{errors.submit}</span>
              </div>
            )}

            {/* Footer */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '20px' }}>
              Đã có tài khoản?{' '}
              <NavLink to="/login" style={{ color: '#DC2626', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập</NavLink>
            </p>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '12px', lineHeight: 1.6 }}>
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <button style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 600, padding: 0 }}>Điều khoản dịch vụ</button>
              {' '}và{' '}
              <button style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 600, padding: 0 }}>Chính sách bảo mật</button>.
            </p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Branding Panel ══ */}
      <div className="auth-desktop-panel auth-panel" style={{
        width: '50%', minHeight: '100vh', position: 'relative', overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(155deg, #1A0A0A 0%, #7F1D1D 35%, #DC2626 70%, #EA580C 100%)',
        display: 'flex', flexDirection: 'column', padding: '48px 56px',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Floating food images — z-index 0, behind content */}
        {/* <div className="food-a" style={{ position: 'absolute', top: '15%', left: '10px', width: '210px', height: '210px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=500&auto=format&fit=crop" alt="BBQ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="food-b" style={{ position: 'absolute', top: '46%', left: '50px', width: '155px', height: '155px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.45)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop" alt="Plate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="food-c" style={{ position: 'absolute', bottom: '12%', left: '10px', width: '175px', height: '175px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.5)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=400&auto=format&fit=crop" alt="Pasta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div> */}

        {/* Content — z-index 1, above food images */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <NavLink to="/" style={{ display: 'block' }}>
            <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '80px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </NavLink>

          <div style={{ paddingBottom: '32px' }}>
            <h2 style={{
              fontSize: '38px', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '32px', letterSpacing: '-0.03em',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)'
            }}>
              Tham gia<br />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>QuickBite</span><br />
              ngay hôm nay.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: Gift, text: 'Freeship đơn đầu tiên' },
                { icon: Shield, text: 'Ưu đãi độc quyền thành viên mới' },
                { icon: Zap, text: 'Tích điểm đổi quà hấp dẫn' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Icon style={{ width: '20px', height: '20px', color: '#fff' }} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
