import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' })
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
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email'
    if (form.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp'
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
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full bg-bg-white rounded-xl shadow-lg p-5 md:p-6" style={{ maxWidth: '380px' }}>
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo_quickbite.png" alt="QuickBite" className="h-8 w-8 object-contain" />
            <span className="font-headline text-xl font-bold">
              <span className="text-brand-accent">Quick</span>
              <span className="text-primary">Bite</span>
            </span>
          </div>
          <p className="text-[13px] text-text-tertiary">Tạo tài khoản mới và bắt đầu đặt món</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <Input
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="0901 234 567"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
          <div className="relative">
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[34px] text-text-disabled hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />

          <Button type="submit" size="lg" className="w-full gap-1.5 mt-1" isLoading={isLoading}>
            Đăng ký
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <p className="text-center text-[13px] text-text-tertiary mt-5">
          Đã có tài khoản?{' '}
          <NavLink to="/login" className="text-primary font-semibold hover:underline">
            Đăng nhập
          </NavLink>
        </p>

        <p className="text-center text-[10px] text-text-disabled mt-3 leading-relaxed">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <button className="text-primary hover:underline">Điều khoản dịch vụ</button> và{' '}
          <button className="text-primary hover:underline">Chính sách bảo mật</button> của QuickBite.
        </p>
      </div>
    </div>
  )
}
