import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
  className,
}: QuantityStepperProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
  const btnSize = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const textSize = size === 'sm' ? 'text-sm w-7' : 'text-base w-9'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          btnSize,
          'rounded-xl flex items-center justify-center transition-all duration-200',
          'border border-border hover:border-primary hover:bg-primary-light',
          'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-transparent',
          'active:scale-90'
        )}
      >
        <Minus className={cn(iconSize, 'text-text-secondary')} />
      </button>
      <span className={cn(textSize, 'text-center font-semibold text-text-primary tabular-nums')}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          btnSize,
          'rounded-xl flex items-center justify-center transition-all duration-200',
          'bg-primary text-text-inverse hover:bg-primary-hover',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          'active:scale-90'
        )}
      >
        <Plus className={cn(iconSize)} />
      </button>
    </div>
  )
}
