'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronLeft, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons'
import { cn } from '@/lib/utils'

const titles: Record<string, string> = {
  '/': 'Investir Bourse',
  '/dashboard': 'Accueil',
  '/dashboard/investments': 'Marché',
  '/dashboard/orders': 'Ordres',
  '/dashboard/kyc': 'Conformité',
  '/login': 'Connexion',
  '/register': 'Inscription',
  '/admin': 'Administration',
  '/admin/users': 'Clients',
  '/admin/offers': 'Offres',
  '/admin/requests': 'Demandes',
}

export default function Navbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const title =
    titles[pathname] ||
    (pathname.startsWith('/admin') ? 'Admin' : pathname.startsWith('/dashboard') ? 'Espace client' : 'Investir Bourse')

  const showBack = pathname.startsWith('/dashboard/') || (pathname.startsWith('/admin/') && pathname !== '/admin')

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Mobile */}
      <div className="lg:hidden flex items-center justify-between h-14 px-4 gap-2">
        {showBack ? (
          <button 
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm"
            aria-label="Retour"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <Link href={userEmail ? '/dashboard' : '/'} className="w-10 h-10 rounded-2xl bg-primary-gradient flex items-center justify-center font-black text-xs text-white shadow-glow">
            IB
          </Link>
        )}
        <div className="flex-1 text-center min-w-0">
          <p className="font-bold text-sm text-slate-900 truncate">{title}</p>
          {userEmail && (
            <p className="text-[10px] text-fin-mute truncate">{userEmail.split('@')[0]}</p>
          )}
        </div>
        <div className="w-10 flex justify-end">
          {userEmail ? (
            <button type="button" className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm" aria-label="Notifications">
              <Bell size={18} />
            </button>
          ) : (
            <button type="button" onClick={() => setOpen((v) => !v)} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Desktop top bar */}
      <div className="hidden lg:flex items-center justify-between h-16 px-6">
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-[11px] text-fin-mute">Marchés régionaux · Temps réel</p>
        </div>
        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              <button type="button" className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm transition-colors">
                <Bell size={18} />
              </button>
              <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                {userEmail}
              </div>
              <SecondaryButton size="sm" onClick={logout}>
                <LogOut size={14} /> Déconnexion
              </SecondaryButton>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Se connecter
              </Link>
              <Link href="/register">
                <PrimaryButton size="sm">Créer un compte</PrimaryButton>
              </Link>
            </>
          )}
        </div>
      </div>

      {open && !userEmail && (
        <div className={cn('lg:hidden border-t border-slate-200 p-4 space-y-2 bg-white')}>
          <Link href="/login" onClick={() => setOpen(false)} className="block p-4 rounded-2xl bg-slate-100 text-slate-900 text-sm font-semibold text-center">
            Se connecter
          </Link>
          <Link href="/register" onClick={() => setOpen(false)} className="block p-4 rounded-2xl bg-primary-gradient text-white text-sm font-semibold text-center">
            Créer un compte
          </Link>
        </div>
      )}
    </header>
  )
}

export function NotificationButton() {
  return (
    <button type="button" className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm" aria-label="Notifications">
      <Bell size={18} />
    </button>
  )
}

export function UserDropdown({ email }: { email: string }) {
  return (
    <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
      {email}
    </div>
  )
}
