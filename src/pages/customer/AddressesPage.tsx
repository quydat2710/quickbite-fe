import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Home, Building2, MoreHorizontal, Plus, Star, Trash2, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const mockAddresses = [
  {
    id: 'a1',
    label: 'Nhà',
    address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM',
    icon: Home,
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Công ty',
    address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
    icon: Building2,
    isDefault: false,
  },
  {
    id: 'a3',
    label: 'Khác',
    address: '45 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM',
    icon: MapPin,
    isDefault: false,
  },
]

export default function AddressesPage() {
  const navigate = useNavigate()
  const [addresses] = useState(mockAddresses)

  return (
    <div className="page-enter min-h-screen bg-bg">
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors">
                <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
              </button>
              <h1 className="text-base font-bold">Địa chỉ đã lưu</h1>
            </div>
            <Button size="sm" className="gap-1">
              <Plus className="h-3 w-3" />
              Thêm mới
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-4 content-medium">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center content-narrow">
            <div className="h-16 w-16 bg-surface-active rounded-xl flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-text-disabled" />
            </div>
            <h3 className="text-text-primary mb-1.5">Chưa có địa chỉ nào</h3>
            <p className="text-[13px] text-text-tertiary mb-6 leading-relaxed">
              Thêm địa chỉ giao hàng để đặt hàng nhanh hơn
            </p>
            <Button size="md" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Thêm địa chỉ
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => {
              const Icon = addr.icon
              return (
                <div
                  key={addr.id}
                  className={cn(
                    'bg-bg-white rounded-xl p-3.5 transition-all hover:shadow-xs',
                    addr.isDefault && 'ring-1 ring-primary/20'
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                      addr.isDefault ? 'bg-primary-light' : 'bg-surface-active'
                    )}>
                      <Icon className={cn('h-4.5 w-4.5', addr.isDefault ? 'text-primary' : 'text-text-secondary')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-text-primary">{addr.label}</h4>
                        {addr.isDefault && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded-md">
                            <Star className="h-2 w-2 fill-primary" />
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-text-tertiary mt-0.5 line-clamp-2">{addr.address}</p>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button className="p-1.5 rounded-md hover:bg-surface-active transition-colors">
                        <Edit3 className="h-3.5 w-3.5 text-text-tertiary" />
                      </button>
                      {!addr.isDefault && (
                        <button className="p-1.5 rounded-md hover:bg-error-bg transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-text-tertiary hover:text-error" />
                        </button>
                      )}
                    </div>
                  </div>

                  {!addr.isDefault && (
                    <div className="mt-2.5 pl-[52px]">
                      <button className="text-[11px] text-primary font-medium hover:underline">
                        Đặt làm mặc định
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
