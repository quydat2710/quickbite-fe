import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-text-inverse hover:bg-primary-hover shadow-sm hover:shadow-md',
        secondary:
          'bg-transparent text-primary border-[1.5px] border-primary hover:bg-primary-light',
        ghost:
          'bg-transparent text-text-secondary hover:bg-surface-active',
        destructive:
          'bg-text-primary text-text-inverse hover:bg-[#404040]',
        accent:
          'bg-brand-accent text-text-inverse hover:bg-brand-accent-hover shadow-sm hover:shadow-md',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs h-8 rounded-lg',
        md: 'px-4 py-2 text-[13px] h-9 rounded-xl',
        lg: 'px-6 py-2.5 text-sm h-11 rounded-xl',
      },
      rounded: {
        default: 'rounded-xl',
        pill: 'rounded-pill',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'pill',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
