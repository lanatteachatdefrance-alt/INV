'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-gradient text-white shadow-glow hover:brightness-105 active:scale-[0.98]',
  secondary:
    'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-[0.98]',
  ghost: 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98]',
  danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
        size === 'sm' && 'px-3.5 py-2 text-xs',
        size === 'md' && 'px-5 py-3 text-sm',
        size === 'lg' && 'px-6 py-3.5 text-sm',
        fullWidth && 'w-full',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ variant = 'secondary', ...props }: ButtonProps) {
  return <PrimaryButton variant={variant} {...props} />
}
