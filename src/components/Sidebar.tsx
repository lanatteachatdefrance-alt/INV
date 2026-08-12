'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LineChart,
  FileText,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Package,
  Inbox,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const clientLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/dashboard/investments', label: 'Marché', icon: LineChart },
  { href: '/dashboard/orders', label: 'Ordres', icon: FileText },
  { href: '/dashboard/kyc', label: 'Conformité', icon: ShieldCheck },
]

const adminLinks = [
  { href: '/admin', label: 'Vue globale', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Clients', icon: Users },
  { href: '/admin/offers', label: 'Offres', icon: Package },
  { href: '/admin/requests', label: 'Demandes', icon: Inbox },
]

export function Sidebar({
  isAdmin,
  userEmail,
}: {
  isAdmin: boolean
  userEmail?: string
}) {
  const pathname = usePathname() || '/'
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const links = pathname.startsWith('/admin') && isAdmin ? adminLinks : clientLinks

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-slate-200 bg-white/90 backdrop-blur-xl sticky top-0 h-[100dvh] transition-all duration-300',
        collapsed ? 'w-[84px]' : 'w-[260px]'
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200">
        <div className="w-10 h-10 rounded-2xl bg-primary-gradient flex items-center justify-center font-black text-sm text-white shadow-glow">
          IB
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900 truncate">Investir Bourse</p>
            <p className="text-[10px] text-fin-mute truncate">Trading &amp; Portefeuille</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active =
            link.href === '/dashboard' || link.href === '/admin'
              ? pathname === link.href
              : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all',
                active
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-[inset_3px_0_0_0_#2563EB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-2">
        {!collapsed && userEmail && (
          <p className="px-3 text-[11px] text-fin-mute truncate">{userEmail}</p>
        )}
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-xs font-medium">Réduire</span>}
        </button>
      </div>
    </aside>
  )
}
