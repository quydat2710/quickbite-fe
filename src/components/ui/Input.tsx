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
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 px-3.5 py-2 text-[13px] font-medium',
              'bg-surface border border-border rounded-xl',
              'shadow-xs transition-all duration-150',
              'placeholder:text-text-disabled placeholder:font-normal',
              'hover:border-border-hover',
              'focus:border-primary focus:shadow-focus focus:outline-none',
              error && 'border-error bg-error-bg focus:shadow-none',
              props.disabled && 'bg-surface-hover border-border cursor-not-allowed opacity-60',
              isSearch && 'pl-9 rounded-pill',
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
