import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, ArrowRight, Gift, Shield, Zap,
  User, Phone, Mail, Lock, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) errs.phone = 'Nhập số điện thoại'
    if (!form.email.trim()) errs.email = 'Nhập email'
    if (form.password.length < 6)
      errs.password = 'Tối thiểu 6 ký tự'
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Mật khẩu không khớp'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse bg-bg font-body overflow-hidden">
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

      {/* ══════════════════ RIGHT: Branding (Reversed) ══════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#FDF8F5] shadow-[-20px_0_40px_rgba(0,0,0,0.03)] z-20" style={{ animation: 'slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {/* Soft background decor */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(239,68,68,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.08)_0%,transparent_50%)]" />

        {/* Floating Foods - Centered more and larger */}
        <FoodFloat src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop" alt="BBQ" className="top-[12%] left-[45%] w-64 h-64 rotate-6" />
        <FoodFloat src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop" alt="Plate" className="top-[45%] left-[68%] w-48 h-48 rotate-12" />
        <FoodFloat src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=600&auto=format&fit=crop" alt="Pasta" className="bottom-[10%] left-[35%] w-56 h-56 -rotate-6" />
        <FoodFloat src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop" alt="Healthy" className="bottom-[32%] right-[8%] w-40 h-40 -rotate-3" />

        <div className="relative z-10 flex flex-col justify-between pl-16 lg:pl-28 xl:pl-36 pr-8 pt-20 pb-12 text-gray-900 w-full">
          <NavLink to="/" className="block w-fit hover:opacity-90 transition-opacity">
            <img src="./src/assets/logo_quickbite.png" alt="QuickBite" className="h-32 w-auto object-contain object-left" />
          </NavLink>

          <div className="max-w-[400px]">
            <h1 className="text-4xl xl:text-[2.75rem] font-extrabold leading-[1.15] tracking-tight text-gray-900">
              Tham gia
              <br />
              <span className="text-primary">QuickBite</span>
              <br />
              ngay hôm nay.
            </h1>
            <div className="space-y-5 mt-10">
              {[
                { icon: Gift, text: 'Freeship đơn đầu tiên' },
                { icon: Shield, text: 'Ưu đãi độc quyền thành viên mới' },
                { icon: Zap, text: 'Tích điểm đổi quà hấp dẫn' },
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

      {/* ══════════════════ LEFT: Form ══════════════════ */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 relative z-10" style={{ animation: 'slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
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
              <h1 className="text-xl font-bold text-text-primary">Tạo tài khoản</h1>
            </div>

            {/* Desktop title */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">Tạo tài khoản mới</h1>
              <p className="text-text-tertiary mt-1.5 text-[14.5px]">Nhập thông tin để bắt đầu đặt món ngon</p>
            </div>

            {/* Social */}
            <div className="hidden lg:grid grid-cols-2 gap-3 mb-5">
              <SocialBtn logo={<GoogleLogo />} label="Google" />
              <SocialBtn logo={<FbLogo />} label="Facebook" />
            </div>
            <div className="hidden lg:flex items-center gap-3 mb-5">
              <div className="h-px bg-border flex-1" />
              <span className="text-[11px] text-text-disabled font-semibold uppercase tracking-wider px-1">hoặc</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-6">

              {/* Section 1: Thông tin cá nhân */}
              <div className="space-y-5">
                <IconInput
                  icon={User}
                  label="Họ và tên"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  error={errors.fullName}
                />
                <div className="grid grid-cols-2 gap-4">
                  <IconInput
                    icon={Phone}
                    label="Số điện thoại"
                    type="tel"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    error={errors.phone}
                  />
                  <IconInput
                    icon={Mail}
                    label="Email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    error={errors.email}
                  />
                </div>
              </div>

              {/* Divider between sections */}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px bg-divider flex-1" />
                <span className="text-[12px] text-text-tertiary font-medium uppercase tracking-wider">Bảo mật tài khoản</span>
                <div className="h-px bg-divider flex-1" />
              </div>

              {/* Section 2: Mật khẩu */}
              <div className="space-y-5">
                <IconInput
                  icon={Lock}
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  error={errors.password}
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
                <IconInput
                  icon={Lock}
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-[15px] gap-2 !rounded-xl"
                  isLoading={isLoading}
                >
                  Tạo tài khoản
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

            <p className="text-center text-sm text-text-tertiary mt-6">
              Đã có tài khoản?{' '}
              <NavLink to="/login" className="text-primary font-semibold hover:underline">Đăng nhập</NavLink>
            </p>

            <p className="text-center text-[11.5px] text-text-disabled mt-3 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <button className="text-primary hover:underline">Điều khoản dịch vụ</button>{' '}
              và <button className="text-primary hover:underline">Chính sách bảo mật</button> của QuickBite.
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
