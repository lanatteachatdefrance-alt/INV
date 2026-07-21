import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFcfa(value: number, opts?: { compact?: boolean }) {
  if (opts?.compact && Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} M FCFA`
  }
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA`
}

export function formatPct(value: number, digits = 2) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toLocaleString('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`
}

export function tickerFromTitle(title: string) {
  const match = title.match(/\(([^)]+)\)/)
  if (match) return match[1]
  return title.split(' ')[0]?.slice(0, 4).toUpperCase() || 'IB'
}

export function initialsFromTitle(title: string) {
  const ticker = tickerFromTitle(title)
  return ticker.slice(0, 2).toUpperCase()
}
