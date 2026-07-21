'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function AnimatedNumber({
  value,
  className,
  formatter,
  duration = 700,
}: {
  value: number
  className?: string
  formatter?: (n: number) => string
  duration?: number
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const from = display
    const delta = value - from

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + delta * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const text = formatter ? formatter(display) : Math.round(display).toLocaleString('fr-FR')

  return <span className={cn('tabular-nums', className)}>{text}</span>
}
