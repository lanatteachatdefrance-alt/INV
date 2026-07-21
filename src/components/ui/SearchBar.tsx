'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fin-mute" size={18} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="fin-input pl-11"
      />
    </div>
  )
}
