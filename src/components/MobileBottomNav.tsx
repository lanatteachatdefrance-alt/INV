'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LineChart,
  Briefcase,
  FileText,
  MoreHorizontal,
  LayoutDashboard,
  Users,
  Package,
  Inbox,
  LogIn,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = {
  href: string
  label: string
  icon: LucideIcon
  match: (p: string) => boolean
}

const clientItems: Item[] = [
  { href: '/dashboard', label: 'Accueil', icon: Home, match: (p) => p === '/dashboard' },
  {
    href: '/dashboard/investments',
    label: 'Marché',
    icon: LineChart,
    match: (p) => p.startsWith('/dashboard/investments'),
  },
  {
    href: '/dashboard#valeurs',
    label: 'Portefeuille',
    icon: Briefcase,
    match: () => false,
  },
  {
    href: '/dashboard/active-investments',
    label: 'Ordres',
    icon: FileText,
    match: (p) => p.startsWith('/dashboard/active-investments'),
  },
  {
    href: '/dashboard/kyc',
    label: 'Plus',
    icon: MoreHorizontal,
    match: (p) => p.startsWith('/dashboard/kyc'),
  },
]

const adminItems: Item[] = [
  { href: '/admin', label: 'Admin', icon: LayoutDashboard, match: (p) => p === '/admin' },
  { href: '/admin/users', label: 'Clients', icon: Users, match: (p) => p.startsWith('/admin/users') },
  { href: '/admin/offers', label: 'Offres', icon: Package, match: (p) => p.startsWith('/admin/offers') },
  { href: '/admin/requests', label: 'Inbox', icon: Inbox, match: (p) => p.startsWith('/admin/requests') },
  { href: '/dashboard', label: 'App', icon: Home, match: () => false },
]

const guestItems: Item[] = [
  { href: '/', label: 'Accueil', icon: Home, match: (p) => p === '/' },
  { href: '/login', label: 'Connexion', icon: LogIn, match: (p) => p.startsWith('/login') },
  { href: '/register', label: 'Compte', icon: UserPlus, match: (p) => p.startsWith('/register') },
]

export default function MobileBottomNav({
  isLoggedIn,
  isAdmin,
}: {
  isLoggedIn: boolean
  isAdmin: boolean
}) {
  const pathname = usePathname() || '/'
  const isAdminRoute = pathname.startsWith('/admin')
  const items = isAdmin && isAdminRoute ? adminItems : isLoggedIn ? clientItems : guestItems

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[60] border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigation"
    >
      <ul
        className={cn(
          'grid max-w-lg mx-auto h-[4.35rem]',
          items.length === 3 ? 'grid-cols-3' : 'grid-cols-5'
        )}
      >
        {items.map((item) => {
          const active = item.match(pathname)
          const Icon = item.icon
          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 h-full px-1 transition-colors',
                  active ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-semibold tracking-wide truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
