import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Tag, Copy, Check, Clock, ShoppingBasket, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

type VoucherCategory = 'all' | 'restaurant' | 'freeship' | 'discount'

const categoryTabs: { id: VoucherCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'discount', label: 'Giảm giá' },
  { id: 'freeship', label: 'Freeship' },
  { id: 'restaurant', label: 'Nhà hàng' },
]

const mockVouchers = [
  {
    id: 'v1',
    code: 'CHAOQUICKBITE',
    title: 'Giảm 50% đơn đầu tiên',
    description: 'Giảm tối đa 30.000đ cho đơn từ 60.000đ',
    category: 'discount' as const,
    expiresAt: '2026-06-30',
    minOrder: 60000,
    maxDiscount: 30000,
    icon: Tag,
    gradient: 'from-primary to-secondary',
  },
  {
    id: 'v2',
    code: 'FREESHIP5K',
    title: 'Freeship đơn từ 50K',
    description: 'Miễn phí giao hàng trong bán kính 5km',
    category: 'freeship' as const,
    expiresAt: '2026-05-31',
    minOrder: 50000,
    maxDiscount: 25000,
    icon: Truck,
    gradient: 'from-info to-blue-400',
  },
  {
    id: 'v3',
    code: 'FLASH30',
    title: 'Flash Sale giảm 30%',
    description: 'Giảm tối đa 25.000đ cho mọi đơn hàng',
    category: 'discount' as const,
    expiresAt: '2026-05-20',
    minOrder: 40000,
    maxDiscount: 25000,
    icon: Tag,
    gradient: 'from-brand-accent to-orange-400',
  },
  {
    id: 'v4',
    code: 'BUNBO20',
    title: 'Giảm 20% Bún Bò Huế',
    description: 'Áp dụng tại Bún Bò Huế 3 Đình',
    category: 'restaurant' as const,
    expiresAt: '2026-06-15',
    minOrder: 0,
    maxDiscount: 20000,
    icon: ShoppingBasket,
    gradient: 'from-success to-emerald-400',
  },
  {
    id: 'v5',
    code: 'PIZZA1FOR1',
    title: 'Mua 1 tặng 1 Pizza',
    description: 'Áp dụng tại Pizza Express, size M',
    category: 'restaurant' as const,
    expiresAt: '2026-05-25',
    minOrder: 100000,
    maxDiscount: 159000,
    icon: ShoppingBasket,
    gradient: 'from-secondary to-red-400',
  },
  {
    id: 'v6',
    code: 'FREESHIPMAX',
    title: 'Freeship không giới hạn',
    description: 'Miễn phí giao hàng cho mọi khoảng cách',
    category: 'freeship' as const,
    expiresAt: '2026-05-18',
    minOrder: 80000,
    maxDiscount: 50000,
    icon: Truck,
    gradient: 'from-violet-500 to-purple-400',
  },
]

export default function PromotionsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<VoucherCategory>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = activeTab === 'all'
    ? mockVouchers
    : mockVouchers.filter((v) => v.category === activeTab)

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  return (
    <div className="page-enter min-h-screen bg-bg">
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3">
          <div className="flex items-center gap-2.5 mb-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors md:hidden">
              <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
            </button>
            <h1 className="text-lg font-bold">Khuyến mãi</h1>
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all duration-200 shrink-0',
                  activeTab === tab.id
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'bg-surface-active text-text-secondary hover:bg-surface-hover'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-4 content-medium">
        {filtered.length === 0 ? (
          <div className="text-center py-14">
            <div className="h-14 w-14 bg-surface-active rounded-xl flex items-center justify-center mx-auto mb-3">
              <Tag className="h-7 w-7 text-text-disabled" />
            </div>
            <h3 className="text-text-secondary mb-1">Không có khuyến mãi</h3>
            <p className="text-[13px] text-text-tertiary">Chưa có voucher nào trong danh mục này</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((voucher) => {
              const Icon = voucher.icon
              const isCopied = copiedId === voucher.id
              return (
                <div
                  key={voucher.id}
                  className="bg-bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="flex">
                    {/* Left color strip */}
                    <div className={cn('w-[70px] md:w-[90px] bg-gradient-to-b shrink-0 flex flex-col items-center justify-center text-white p-2.5', voucher.gradient)}>
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Voucher</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-[13px] font-semibold text-text-primary line-clamp-1">{voucher.title}</h4>
                        <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-1">{voucher.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-text-disabled">
                          <Clock className="h-2.5 w-2.5" />
                          HSD: {formatDate(voucher.expiresAt)}
                        </div>
                        <button
                          onClick={() => handleCopy(voucher.id, voucher.code)}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                            isCopied
                              ? 'bg-success-bg text-success'
                              : 'bg-primary-light text-primary hover:bg-primary/15'
                          )}
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Đã sao chép
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              {voucher.code}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
