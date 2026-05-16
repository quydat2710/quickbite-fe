import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Shield,
  Gift,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const menuSections = [
  {
    title: 'Tài khoản',
    items: [
      { icon: MapPin, label: 'Địa chỉ đã lưu', desc: '2 địa chỉ', href: '/profile/addresses' },
      { icon: CreditCard, label: 'Phương thức thanh toán', desc: 'VNPay, MoMo', href: '/profile/payment' },
      { icon: Gift, label: 'Khuyến mãi', desc: '3 voucher', href: '/promotions' },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { icon: Bell, label: 'Thông báo', desc: 'Đang bật', href: '/notifications' },
      { icon: Shield, label: 'Bảo mật', desc: 'Đổi mật khẩu', href: '/profile/security' },
      { icon: Settings, label: 'Cài đặt chung', desc: '', href: '/profile/settings' },
      { icon: HelpCircle, label: 'Trợ giúp & Hỗ trợ', desc: '', href: '/help' },
    ],
  },
]

export default function ProfilePage() {
  return (
    <div className="page-enter min-h-screen">
      {/* Profile Card */}
      <div className="bg-bg-white">
        <div className="container py-5 md:py-7">
          <div className="flex items-center gap-3.5 md:gap-4">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shrink-0 shadow-md">
              <User className="h-7 w-7 md:h-8 md:w-8 text-text-inverse" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold">Nguyễn Văn Đạt</h1>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                dat.nguyen@email.com
              </p>
              <p className="text-[13px] text-text-tertiary">0901 234 567</p>
            </div>
            <button className="hidden md:inline-flex px-3.5 py-1.5 rounded-lg border border-border text-[13px] font-medium text-text-secondary hover:bg-surface-active transition-colors">
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="container py-3 md:py-5">
        <div className="content-medium">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-3">
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 px-1">
                {section.title}
              </p>
              <div className="bg-bg-white rounded-xl shadow-xs overflow-hidden">
                {section.items.map(({ icon: Icon, label, desc, href }, idx) => (
                  <NavLink
                    key={label}
                    to={href}
                    className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-surface-hover transition-colors"
                    style={{
                      borderBottom:
                        idx < section.items.length - 1
                          ? '1px solid var(--color-divider)'
                          : 'none',
                    }}
                  >
                    <div className="h-9 w-9 rounded-lg bg-surface-active flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <span className="text-[13px] font-medium text-text-primary">
                        {label}
                      </span>
                      {desc && (
                        <p className="text-[11px] text-text-tertiary mt-0.5">
                          {desc}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-text-disabled shrink-0" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button className="w-full flex items-center justify-center gap-1.5 py-3 mt-3 rounded-xl text-[13px] font-medium text-error bg-bg-white hover:bg-error-bg transition-colors shadow-xs">
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>

          <p className="text-center text-[10px] text-text-disabled mt-4 pb-6">
            QuickBite v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}
