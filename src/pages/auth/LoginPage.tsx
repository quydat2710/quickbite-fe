import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowRight, Store, Clock, Headphones,
  Phone, Lock, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores'

/* ─── Floating food image with glow ─── */
function FoodFloat({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl scale-110" />
      <img src={src} alt={alt} className="relative w-full h-full object-cover rounded-3xl shadow-2xl" />
    </div>
  )
}

/* ─── Icon Input ─── */
function IconInput({
  icon: Icon, label, error, rightSlot, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType
  label: string
  error?: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-semibold text-text-primary">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none z-10">
          <Icon className="h-5 w-5" />
        </span>
        <input
          {...props}
          style={{ paddingLeft: '3.2rem', paddingRight: rightSlot ? '3.2rem' : '1.2rem' }}
          className={`w-full h-12 text-[15px] bg-white border rounded-xl
                      transition-all duration-200 placeholder:text-text-disabled placeholder:font-normal
                      hover:border-border-hover
                      focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                      focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]
                      ${error ? 'border-error bg-error-bg/30 text-error' : 'border-border text-text-primary'}`}
        />
        {rightSlot && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">{rightSlot}</span>
        )}
      </div>
      {error && <p className="mt-1 text-[13px] text-error font-medium">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    setError('')
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setUser({
      id: 'u1',
      fullName: 'Nguyễn Văn Đạt',
      email: 'dat.nguyen@email.com',
      phone: phone,
      avatarUrl: null,
      role: 'CUSTOMER',
    })
    setIsLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg font-body overflow-hidden">
      <style>{`
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ══════════════════ LEFT: Branding ══════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#FDF8F5] shadow-[20px_0_40px_rgba(0,0,0,0.03)] z-20" style={{ animation: 'slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Soft background decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

        {/* Floating Foods - Centered more and larger */}
        <FoodFloat src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" alt="Burger" className="top-[12%] left-[45%] w-64 h-64 rotate-6" />
        <FoodFloat src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop" alt="Pizza" className="top-[45%] left-[68%] w-48 h-48 rotate-12" />
        <FoodFloat src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop" alt="Sushi" className="bottom-[10%] left-[35%] w-56 h-56 -rotate-6" />
        <FoodFloat src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop" alt="Salad" className="bottom-[32%] right-[8%] w-40 h-40 -rotate-3" />

        <div className="relative z-10 flex flex-col justify-between px-16 lg:px-24 xl:px-32 pt-20 pb-12 text-gray-900 w-full">
          <NavLink to="/" className="block w-fit hover:opacity-90 transition-opacity">
            <img src="/logo_quickbite.png" alt="QuickBite" className="h-28 w-auto object-contain object-left" />
          </NavLink>

          <div className="max-w-[400px]">
            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-gray-900">
              Đặt món ngon,
              <br />
              <span className="text-primary">giao tận nơi.</span>
            </h1>
            <div className="space-y-5 mt-10">
              {[
                { icon: Store, text: 'Hơn 1,000+ nhà hàng' },
                { icon: Clock, text: '30 phút giao hàng' },
                { icon: Headphones, text: '24/7 hỗ trợ' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[16px] font-semibold text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div />
        </div>
      </div>

      {/* ══════════════════ RIGHT: Form ══════════════════ */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 relative z-10" style={{ animation: 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* bg decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[460px] lg:max-w-[440px] relative">
          <div className="lg:p-0 lg:shadow-none lg:bg-transparent lg:rounded-none bg-white rounded-2xl shadow-xl p-8 sm:p-10">

            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <img src="/logo_quickbite.png" alt="QuickBite" className="h-10 w-10 object-contain" />
                <span className="font-headline text-2xl font-bold tracking-tight">
                  <span className="text-brand-accent">Quick</span>
                  <span className="text-primary">Bite</span>
                </span>
              </div>
              <h1 className="text-xl font-bold text-text-primary">Đăng nhập</h1>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Chào mừng trở lại!</h1>
              <p className="text-text-tertiary mt-2 text-[15px]">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
            </div>

            {/* Social */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mb-6">
              <SocialBtn logo={<GoogleLogo />} label="Google" />
              <SocialBtn logo={<FbLogo />} label="Facebook" />
            </div>
            <div className="hidden lg:flex items-center gap-3 mb-6">
              <div className="h-px bg-border flex-1" />
              <span className="text-[11px] text-text-disabled font-semibold uppercase tracking-wider px-1">hoặc</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <IconInput
                icon={Phone}
                label="Số điện thoại"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="space-y-3">
                <IconInput
                  icon={Lock}
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-text-disabled hover:text-text-secondary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                />
                <div className="flex justify-end">
                  <NavLink to="/forgot-password" className="text-[13px] text-primary font-semibold hover:underline">
                    Quên mật khẩu?
                  </NavLink>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-error-bg text-error text-sm border border-error/10">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-[15px] gap-2 !rounded-xl"
                  isLoading={isLoading}
                >
                  Đăng nhập
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Mobile social */}
            <div className="lg:hidden mt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-border flex-1" />
                <span className="text-[11px] text-text-disabled font-semibold uppercase tracking-wider px-1">hoặc</span>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <RoundSocialBtn logo={<GoogleLogo />} />
                <RoundSocialBtn logo={<FbLogo />} />
                <RoundSocialBtn logo={<AppleLogo />} />
              </div>
            </div>

            <p className="text-center text-[14.5px] text-text-tertiary mt-6">
              Chưa có tài khoản?{' '}
              <NavLink to="/register" className="text-primary font-semibold hover:underline">Đăng ký miễn phí</NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialBtn({ logo, label }: { logo: React.ReactNode; label: string }) {
  return (
    <button type="button" className="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-white hover:bg-gray-50 text-sm font-medium transition-all hover:shadow-sm hover:border-border-hover">
      {logo}{label}
    </button>
  )
}
function RoundSocialBtn({ logo }: { logo: React.ReactNode }) {
  return (
    <button type="button" className="h-11 w-11 rounded-full border border-border bg-white hover:bg-gray-50 flex items-center justify-center transition-all hover:shadow-sm hover:border-border-hover">
      {logo}
    </button>
  )
}
function GoogleLogo() {
  return (
    <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
function FbLogo() {
  return (
    <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
function AppleLogo() {
  return (
    <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="#000">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}
