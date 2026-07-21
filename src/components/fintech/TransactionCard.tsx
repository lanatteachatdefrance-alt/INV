'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn, formatFcfa, initialsFromTitle } from '@/lib/utils'

export type OrderItem = {
  id: string
  title: string
  side: 'achat' | 'vente'
  quantity?: number
  amount: number
  status: string
  date?: string
}

function statusTone(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  const s = status.toLowerCase()
  if (s.includes('termin') || s.includes('valid') || s.includes('complét') || s === 'completed') return 'success'
  if (s.includes('cours') || s.includes('attente') || s.includes('pending')) return 'warning'
  if (s.includes('annul') || s.includes('échou') || s.includes('cancel')) return 'danger'
  return 'neutral'
}

function statusLabel(status: string) {
  const s = status.toLowerCase()
  if (s.includes('termin') || s === 'completed') return 'Terminé'
  if (s.includes('cours') || s.includes('attente') || s === 'pending') return 'En cours'
  if (s.includes('annul') || s.includes('échou')) return 'Annulé'
  return status
}

export function TransactionCard({
  items,
  href = '/dashboard/active-investments',
  title = 'Mes ordres',
}: {
  items: OrderItem[]
  href?: string
  title?: string
}) {
  return (
    <GlassCard padding="none" hover={false}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-white">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-fin-primary hover:text-blue-400">
          Voir tout
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-fin-mute">Aucun ordre pour le moment.</p>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={href}
              className="flex items-center gap-3 px-5 py-4 hover:bg-fin-hover/60 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-fin-surface border border-white/10 flex items-center justify-center text-xs font-bold text-fin-primary shrink-0">
                {initialsFromTitle(item.title)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-fin-mute mt-0.5">
                  <span className={item.side === 'achat' ? 'text-fin-success' : 'text-fin-danger'}>
                    {item.side === 'achat' ? 'Achat' : 'Vente'}
                  </span>
                  {item.quantity != null && <> · {item.quantity} titres</>}
                </p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={statusTone(item.status)} className="mb-1">
                  {statusLabel(item.status)}
                </StatusBadge>
                <p className="text-sm font-semibold text-white">{formatFcfa(item.amount)}</p>
              </div>
              <ChevronRight size={16} className="text-fin-mute shrink-0" />
            </Link>
          ))
        )}
      </div>
    </GlassCard>
  )
}

export function ActivityCard(props: {
  items: OrderItem[]
  href?: string
  title?: string
}) {
  return <TransactionCard {...props} />
}
