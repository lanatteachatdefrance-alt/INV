'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--fin-primary)] text-white shadow-[0_8px_24px_rgba(20,40,59,0.18)] hover:bg-[var(--fin-primary-dark)] active:scale-[0.98]',

  secondary:
    'bg-white text-[var(--fin-primary)] border border-[var(--fin-border)] shadow-sm hover:bg-[var(--fin-primary-light)] hover:border-[var(--fin-accent)]/30 active:scale-[0.98]',

  ghost:
    'bg-transparent text-[var(--fin-text-secondary)] hover:text-[var(--fin-primary)] hover:bg-[var(--fin-primary-light)] active:scale-[0.98]',

  danger:
    'bg-[var(--fin-danger-light)] text-[var(--fin-danger)] border border-[var(--fin-danger)]/20 hover:bg-[var(--fin-danger-light)]',

  success:
    'bg-[var(--fin-success-light)] text-[var(--fin-success)] border border-[var(--fin-success)]/20 hover:bg-[var(--fin-success-light)]',
}

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
  }

export function PrimaryButton({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',

        size === 'sm' &&
          'px-3.5 py-2 text-xs',

        size === 'md' &&
          'px-5 py-3 text-sm',

        size === 'lg' &&
          'px-6 py-3.5 text-sm',

        fullWidth &&
          'w-full',

        variants[variant],

        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  variant = 'secondary',
  ...props
}: ButtonProps) {
  return (
    <PrimaryButton
      variant={variant}
      {...props}
    />
  )
}