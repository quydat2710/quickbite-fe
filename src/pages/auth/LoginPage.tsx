import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Store, Clock, Headphones, Phone, Lock, AlertCircle, Mail } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

/* ── Shared logo SVGs ── */
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

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    setError('')
    setIsLoading(true)
    try {
      const { role } = await login(phone, password)
      // Redirect based on role
      const redirectMap: Record<string, string> = {
        CUSTOMER: '/',
        RESTAURANT_OWNER: '/restaurant',
        DRIVER: '/driver',
        ADMIN: '/admin',
      }
      navigate(redirectMap[role] || '/')
    } catch (err: any) {
      // Extract message from API response body (format: { error: { message: '...' } })
      const apiMessage = err?.response?.data?.error?.message
        || err?.response?.data?.message

      const status = err?.response?.status

      if (status === 401 || status === 400) {
        // Credential error — show message from API or friendly fallback
        setError(apiMessage || 'Số điện thoại/email hoặc mật khẩu không đúng')
      } else if (status === 500 || !status) {
        // Backend crash or network error on the login endpoint almost always means
        // the microservice rejected the credentials but the gateway didn't re-map it.
        // Show a safe, friendly message instead of the raw technical error.
        setError('Số điện thoại/email hoặc mật khẩu không đúng')
      } else {
        setError(apiMessage || 'Đã xảy ra lỗi, vui lòng thử lại sau')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = '/v1/auth/google'
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', height: '52px', paddingLeft: '48px', paddingRight: '16px',
    fontSize: '15px', borderRadius: '14px', border: `1.5px solid ${focusedField === field ? '#DC2626' : '#E5E7EB'}`,
    background: '#fff', outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(220,38,38,0.12)' : 'none',
    transition: 'all 0.2s', color: '#0F172A', boxSizing: 'border-box',
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F5F7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes authFadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes authFadeLeft { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes authFloatA { 0%,100% { transform:rotate(6deg) translateY(0); } 50% { transform:rotate(6deg) translateY(-12px); } }
        @keyframes authFloatB { 0%,100% { transform:rotate(-8deg) translateY(0); } 50% { transform:rotate(-8deg) translateY(-16px); } }
        @keyframes authFloatC { 0%,100% { transform:rotate(3deg) translateY(0); } 50% { transform:rotate(3deg) translateY(-10px); } }
        .auth-panel { animation: authFadeLeft 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .auth-form  { animation: authFadeUp  0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .food-a { animation: authFloatA 4s ease-in-out infinite; }
        .food-b { animation: authFloatB 5s ease-in-out infinite 0.5s; }
        .food-c { animation: authFloatC 4.5s ease-in-out infinite 1s; }
        @media (max-width: 1023px) { .auth-desktop-panel { display:none!important; } }
        @media (min-width: 1024px) { .auth-mobile-header { display:none!important; } }
      `}</style>

      {/* ══ LEFT: Branding Panel ══ */}
      <div className="auth-desktop-panel auth-panel" style={{
        width: '50%', minHeight: '100vh', position: 'relative', overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(155deg, #1A0A0A 0%, #7F1D1D 35%, #DC2626 70%, #EA580C 100%)',
        display: 'flex', flexDirection: 'column', padding: '48px 56px',
      }}>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* Floating food images — z-index 0, behind content */}
        <div className="food-a" style={{ position: 'absolute', top: '18%', right: '0px', width: '200px', height: '200px', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop" alt="Burger" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="food-b" style={{ position: 'absolute', top: '48%', right: '60px', width: '150px', height: '150px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.45)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop" alt="Pizza" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="food-c" style={{ position: 'absolute', bottom: '10%', right: '24px', width: '170px', height: '170px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.5)', zIndex: 0 }}>
          <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=400&auto=format&fit=crop" alt="Sushi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Content — z-index 1, above food images */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <NavLink to="/" style={{ display: 'block' }}>
            <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '80px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </NavLink>

          <div style={{ paddingBottom: '32px' }}>
            <h2 style={{
              fontSize: '42px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '32px', letterSpacing: '-0.03em',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)'
            }}>
              Đặt món ngon,<br />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>giao tận nơi.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: Store, text: 'Hơn 1,000+ nhà hàng' },
                { icon: Clock, text: '30 phút giao hàng cực nhanh' },
                { icon: Headphones, text: 'Hỗ trợ 24/7 tận tình' },
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
      </div>{/* ── End LEFT Panel ── */}

      {/* ══ RIGHT: Form ══ */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', minHeight: '100vh', position: 'relative' }}>
          {/* Mobile gradient header */}
          <div className="auth-mobile-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '200px', background: 'linear-gradient(155deg, #7F1D1D, #DC2626, #EA580C)', pointerEvents: 'none' }} />

          <div className="auth-form" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
            {/* Mobile logo */}
            <div className="auth-mobile-header" style={{ textAlign: 'center', marginBottom: '24px', position: 'relative' }}>
              <NavLink to="/">
                <img src="/logo_quickbite.png" alt="QuickBite" style={{ height: '60px', width: 'auto', filter: 'brightness(0) invert(1)', margin: '0 auto 8px' }} />
              </NavLink>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: 500 }}>Đặt món ngon, giao tận nơi</p>
            </div>

            <div style={{ background: '#fff', borderRadius: '24px', padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
              {/* Header */}
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '6px', letterSpacing: '-0.02em' }}>Chào mừng trở lại!</h1>
                <p style={{ fontSize: '15px', color: '#64748B' }}>Đăng nhập vào tài khoản của bạn để tiếp tục</p>
              </div>

              {/* Social login */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <button type="button" onClick={handleGoogleLogin} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  height: '48px', borderRadius: '14px', border: '1.5px solid #E5E7EB',
                  background: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Inter, system-ui, sans-serif', color: '#0F172A', width: '100%',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <GoogleLogo /> Tiếp tục với Google
                </button>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
                <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>hoặc</span>
                <div style={{ flex: 1, height: '1px', background: '#F3F4F6' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Identifier field (phone or email) */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '8px' }}>Số điện thoại hoặc Email</label>
                  <div style={{ position: 'relative' }}>
                    {phone.includes('@')
                      ? <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94A3B8', pointerEvents: 'none' }} />
                      : <Phone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94A3B8', pointerEvents: 'none' }} />
                    }
                    <input
                      type="text"
                      placeholder="Nhập SĐT hoặc email"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle('phone')}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '8px' }}>Mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94A3B8', pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle('password'), paddingRight: '52px' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex' }}>
                      {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                    </button>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <NavLink to="/forgot-password" style={{ fontSize: '13px', color: '#DC2626', fontWeight: 600, textDecoration: 'none' }}>Quên mật khẩu?</NavLink>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}>
                    <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={isLoading} style={{
                  width: '100%', height: '56px', borderRadius: '16px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)',
                  color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 8px 24px rgba(220,38,38,0.35)', opacity: isLoading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.45)' } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.35)' }}
                >
                  {isLoading ? 'Đang đăng nhập...' : <>Đăng nhập <ArrowRight style={{ width: '20px', height: '20px' }} /></>}
                </button>
              </form>

              {/* Footer */}
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
                Chưa có tài khoản?{' '}
                <NavLink to="/register" style={{ color: '#DC2626', fontWeight: 700, textDecoration: 'none' }}>Đăng ký miễn phí</NavLink>
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

