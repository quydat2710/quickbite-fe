import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores'

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
    if (!phone || !password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }
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
          <p className="text-[13px] text-text-tertiary">Đăng nhập để đặt món ngon giao tận nơi</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="relative">
            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="0901 234 567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Phone className="absolute right-3.5 top-[34px] h-3.5 w-3.5 text-text-disabled" />
          </div>

          <div className="relative">
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[34px] text-text-disabled hover:text-text-secondary transition-colors"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          {error && <p className="text-[12px] text-error">{error}</p>}

          <div className="flex justify-end">
            <NavLink to="/forgot-password" className="text-[12px] text-primary font-medium hover:underline">
              Quên mật khẩu?
            </NavLink>
          </div>

          <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
            Đăng nhập
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-divider flex-1" />
          <span className="text-[11px] text-text-disabled">hoặc</span>
          <div className="h-px bg-divider flex-1" />
        </div>

        {/* Social Login */}
        <div className="space-y-2.5">
          <button className="w-full flex items-center justify-center gap-2.5 h-10 rounded-pill border border-border text-[13px] font-medium hover:bg-surface-active transition-colors">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Đăng nhập bằng Google
          </button>
        </div>

        <p className="text-center text-[13px] text-text-tertiary mt-5">
          Chưa có tài khoản?{' '}
          <NavLink to="/register" className="text-primary font-semibold hover:underline">
            Đăng ký ngay
          </NavLink>
        </p>
      </div>
    </div>
  )
}
