import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Tag, Truck, CheckCircle2, XCircle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockNotifications } from '@/data/mock'
import type { NotifType } from '@/data/mock'

const notifIcons: Record<NotifType, { icon: React.ElementType; bg: string; color: string }> = {
  ORDER_CONFIRMED: { icon: CheckCircle2, bg: 'bg-info-bg', color: 'text-info' },
  ORDER_CANCELLED: { icon: XCircle, bg: 'bg-error-bg', color: 'text-error' },
  DRIVER_ASSIGNED: { icon: Truck, bg: 'bg-success-bg', color: 'text-success' },
  ORDER_DELIVERED: { icon: Package, bg: 'bg-success-bg', color: 'text-success' },
  PROMOTION: { icon: Tag, bg: 'bg-warning-bg', color: 'text-warning' },
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin} phút trước`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} giờ trước`
  const diffD = Math.floor(diffH / 24)
  return `${diffD} ngày trước`
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length

  // Group by date
  const grouped = mockNotifications.reduce<Record<string, typeof mockNotifications>>((acc, notif) => {
    const date = new Date(notif.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(notif)
    return acc
  }, {})

  return (
    <div className="page-enter min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-bg-white border-b border-divider sticky top-0 md:top-14 z-30">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-surface-active transition-colors">
                <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
              </button>
              <div>
                <h1 className="text-base font-bold">Thông báo</h1>
                {unreadCount > 0 && (
                  <p className="text-[11px] text-text-tertiary">{unreadCount} chưa đọc</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button className="text-[12px] text-primary font-medium hover:underline">
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-4 content-medium">
        {mockNotifications.length === 0 ? (
          <div className="text-center py-14">
            <div className="h-14 w-14 bg-surface-active rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bell className="h-7 w-7 text-text-disabled" />
            </div>
            <h3 className="text-text-secondary mb-1">Chưa có thông báo</h3>
            <p className="text-[13px] text-text-tertiary">Thông báo mới sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([date, notifs]) => (
              <div key={date}>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5 px-1">
                  {date}
                </p>
                <div className="space-y-1.5">
                  {notifs.map((notif) => {
                    const config = notifIcons[notif.type]
                    const Icon = config.icon
                    return (
                      <button
                        key={notif.id}
                        className={cn(
                          'w-full flex gap-2.5 p-3 rounded-xl text-left transition-all duration-200 hover:shadow-xs',
                          notif.isRead ? 'bg-bg-white' : 'bg-primary-light/40 border border-primary/10'
                        )}
                      >
                        <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', config.bg)}>
                          <Icon className={cn('h-4 w-4', config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn('text-[13px] line-clamp-1', notif.isRead ? 'font-medium' : 'font-semibold')}>
                              {notif.title}
                            </p>
                            {!notif.isRead && <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-[11px] text-text-tertiary mt-0.5 line-clamp-2">{notif.body}</p>
                          <p className="text-[10px] text-text-disabled mt-0.5">{timeAgo(notif.createdAt)}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
