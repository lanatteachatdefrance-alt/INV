'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type GlassCardProps = HTMLMotionProps<'div'> & {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5 md:p-6',
  lg: 'p-6 md:p-8',
}

export function GlassCard({
  className,
  children,
  hover = true,
  padding = 'md',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn('glass-card', paddings[padding], hover && 'transition-colors hover:bg-fin-hover/80', className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function DashboardCard(props: GlassCardProps) {
  return <GlassCard {...props} />
}
