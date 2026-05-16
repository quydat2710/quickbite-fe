import { cn } from '@/lib/utils'

type ChipVariant = 'filter' | 'delivered' | 'preparing' | 'cancelled' | 'on-the-way' | 'pending'

interface ChipProps {
  variant?: ChipVariant
  selected?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const chipStyles: Record<ChipVariant, string> = {
  filter: 'bg-surface-active text-text-primary',
  delivered: 'bg-success-bg text-success',
  preparing: 'bg-warning-bg text-warning',
  cancelled: 'bg-error-bg text-error',
  'on-the-way': 'bg-info-bg text-info',
  pending: 'bg-surface-active text-text-secondary',
}

export function Chip({ variant = 'filter', selected, children, onClick, className }: ChipProps) {
  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-pill whitespace-nowrap transition-all duration-150',
        chipStyles[variant],
        selected && 'bg-primary text-text-inverse',
        onClick && 'cursor-pointer hover:opacity-80 active:scale-95',
        className
      )}
    >
      {children}
    </span>
  )
}
