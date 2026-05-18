import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  isSearch?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, isSearch, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="font-medium text-[13px] text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {isSearch && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-11 px-4 py-2.5 text-sm font-medium',
              'bg-surface border border-border rounded-xl',
              'shadow-xs transition-all duration-150',
              'placeholder:text-text-disabled placeholder:font-normal',
              'hover:border-border-hover',
              'focus:border-primary focus:shadow-focus focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1',
              error && 'border-error bg-error-bg focus:shadow-none focus:ring-error/20',
              props.disabled && 'bg-surface-hover border-border cursor-not-allowed opacity-60',
              isSearch && 'pl-11 rounded-pill',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-error mt-1">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-xs text-text-tertiary mt-1">{helperText}</span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
