import { cn } from '@/lib/utils'

type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const styles: Record<Status, string> = {
  success: 'text-fin-success border-fin-success/40 bg-fin-success/10',
  warning: 'text-fin-warning border-fin-warning/40 bg-fin-warning/10',
  danger: 'text-fin-danger border-fin-danger/40 bg-fin-danger/10',
  info: 'text-fin-primary border-fin-primary/40 bg-fin-primary/10',
  neutral: 'text-fin-mute border-white/10 bg-white/5',
}

export function StatusBadge({
  children,
  status = 'neutral',
  className,
}: {
  children: React.ReactNode
  status?: Status
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        styles[status],
        className
      )}
    >
      {children}
    </span>
  )
}
