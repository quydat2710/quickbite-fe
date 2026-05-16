import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type Step = 'phone' | 'otp' | 'password' | 'success'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) { setError('Vui lòng nhập số điện thoại'); return }
    setError('')
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setStep('otp')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 4) { setError('Vui lòng nhập mã OTP'); return }
    setError('')
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsLoading(false)
    setStep('password')
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
    if (newPassword !== confirmPassword) { setError('Mật khẩu không khớp'); return }
    setError('')
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setStep('success')
  }

  const steps = [
    { id: 'phone', label: 'Nhập SĐT' },
    { id: 'otp', label: 'Xác minh' },
    { id: 'password', label: 'Mật khẩu mới' },
  ]

  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full bg-bg-white rounded-xl shadow-lg p-5 md:p-6" style={{ maxWidth: '380px' }}>
        {/* Back & Logo */}
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => step === 'phone' ? navigate('/login') : setStep(step === 'otp' ? 'phone' : 'otp')} className="p-1.5 rounded-lg hover:bg-surface-active transition-colors">
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
          </button>
          <span className="font-headline text-lg font-bold">
            <span className="text-brand-accent">Quick</span>
            <span className="text-primary">Bite</span>
          </span>
        </div>

        {step !== 'success' && (
          <>
            {/* Progress */}
            <div className="flex items-center gap-1 mb-5">
              {steps.map((s, i) => (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className={cn(
                    'h-1 w-full rounded-full transition-colors',
                    i <= stepIndex ? 'bg-primary' : 'bg-surface-active'
                  )} />
                  <span className={cn(
                    'text-[10px] font-medium transition-colors',
                    i <= stepIndex ? 'text-primary' : 'text-text-disabled'
                  )}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            <h1 className="text-lg font-bold mb-1">
              {step === 'phone' && 'Quên mật khẩu'}
              {step === 'otp' && 'Nhập mã xác minh'}
              {step === 'password' && 'Tạo mật khẩu mới'}
            </h1>
            <p className="text-[13px] text-text-tertiary mb-5">
              {step === 'phone' && 'Nhập số điện thoại đã đăng ký để nhận mã OTP'}
              {step === 'otp' && `Mã OTP đã gửi đến số ${phone}`}
              {step === 'password' && 'Đặt mật khẩu mới cho tài khoản của bạn'}
            </p>
          </>
        )}

        {/* Step 1: Phone */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
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
            {error && <p className="text-[12px] text-error">{error}</p>}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Gửi mã OTP
            </Button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div className="relative">
              <Input
                label="Mã OTP"
                type="text"
                placeholder="Nhập 6 chữ số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="tracking-[0.3em] text-center font-mono"
              />
              <KeyRound className="absolute right-3.5 top-[34px] h-3.5 w-3.5 text-text-disabled" />
            </div>
            {error && <p className="text-[12px] text-error">{error}</p>}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Xác minh
            </Button>
            <button type="button" className="w-full text-center text-[12px] text-primary font-medium hover:underline">
              Gửi lại mã (60s)
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <Input
              label="Mật khẩu mới"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-[12px] text-error">{error}</p>}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Đổi mật khẩu
            </Button>
          </form>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="text-center py-4">
            <div className="h-16 w-16 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-lg font-bold mb-1.5">Đổi mật khẩu thành công!</h2>
            <p className="text-[13px] text-text-tertiary mb-5">
              Bạn có thể đăng nhập bằng mật khẩu mới
            </p>
            <Button size="lg" className="w-full" onClick={() => navigate('/login')}>
              Đăng nhập ngay
            </Button>
          </div>
        )}

        {step === 'phone' && (
          <p className="text-center text-[13px] text-text-tertiary mt-5">
            Nhớ mật khẩu?{' '}
            <NavLink to="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập
            </NavLink>
          </p>
        )}
      </div>
    </div>
  )
}
