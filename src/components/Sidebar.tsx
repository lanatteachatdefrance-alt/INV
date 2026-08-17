'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  Wallet,
  CircleUserRound,
} from 'lucide-react'
import { useState } from 'react'

import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

const clientLinks = [
  {
    href: '/dashboard',
    label: 'Tableau de bord',
    icon: Home,
  },
  {
    href: '/dashboard/investments',
    label: 'Marché',
    icon: LineChart,
  },
  {
    href: '/dashboard/orders',
    label: 'Ordres',
    icon: FileText,
  },
  {
    href: '/dashboard/kyc',
    label: 'Conformité',
    icon: ShieldCheck,
  },
]

const adminLinks = [
  {
    href: '/admin',
    label: 'Vue globale',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Clients',
    icon: Users,
  },
  {
    href: '/admin/orders',
    label: 'Offres',
    icon: Package,
  },
  {
    href: '/admin/requests',
    label: 'Demandes',
    icon: Inbox,
  },
]

export function Sidebar({
  isAdmin,
  userEmail,
}: {
  isAdmin: boolean
  userEmail?: string
}) {
  const pathname = usePathname() || '/'
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)

  const supabase = createClient()

  const links =
    pathname.startsWith('/admin') && isAdmin
      ? adminLinks
      : clientLinks

  const logout = async () => {
    try {
      await supabase.auth.signOut({
        scope: 'local',
      })
    } catch (error) {
      console.error(
        'Erreur déconnexion:',
        error
      )
    }

    router.replace('/login')
    router.refresh()
  }

  return (
    <aside
      className={cn(
        `
        hidden
        lg:flex
        flex-col
        sticky
        top-0
        z-50
        h-[100dvh]
        shrink-0
        overflow-hidden

        bg-[#14283B]

        border-r
        border-white/10

        shadow-[8px_0_30px_rgba(13,27,42,0.08)]

        transition-all
        duration-300
        ease-out
        `,
        collapsed
          ? 'w-[82px]'
          : 'w-[270px]'
      )}
    >

      {/* =====================================================
          LOGO
          ===================================================== */}

      <div
        className={cn(
          `
          flex
          h-[78px]
          shrink-0
          items-center
          border-b
          border-white/10
          `,
          collapsed
            ? 'justify-center px-3'
            : 'gap-3 px-5'
        )}
      >

        {/* LOGO */}

        <div
          className="
            relative
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-[#D6A62C]/50
            bg-[#D6A62C]
            text-[#14283B]
            shadow-[0_4px_18px_rgba(214,166,44,0.20)]
          "
        >
          <span className="text-sm font-black tracking-tight">
            IB
          </span>
        </div>

        {!collapsed && (
          <div className="min-w-0">

            <p className="truncate text-sm font-extrabold tracking-tight text-white">
              Investir en Bourse
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#D6A62C]" />

              <p className="truncate text-[10px] font-medium text-white/50">
                Plateforme financière
              </p>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <div className="px-4 pt-6">

        {!collapsed && (
          <p className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">
            {pathname.startsWith('/admin') && isAdmin
              ? 'Administration'
              : 'Espace client'}
          </p>
        )}

        <nav className="space-y-1.5">

          {links.map((link) => {

            const active =
              link.href === '/dashboard' ||
              link.href === '/admin'
                ? pathname === link.href
                : pathname.startsWith(
                    link.href
                  )

            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                title={
                  collapsed
                    ? link.label
                    : undefined
                }
                className={cn(
                  `
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  `,
                  collapsed &&
                    'justify-center',

                  active
                    ? `
                      bg-[#D6A62C]
                      text-[#14283B]
                      shadow-[0_5px_18px_rgba(214,166,44,0.18)]
                      `
                    : `
                      text-white/65
                      hover:bg-white/[0.07]
                      hover:text-white
                      `
                )}
              >

                {/* INDICATEUR ACTIF */}

                {active && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-6
                      w-1
                      -translate-y-1/2
                      rounded-r-full
                      bg-white/70
                    "
                  />
                )}

                <Icon
                  size={19}
                  strokeWidth={
                    active
                      ? 2.4
                      : 1.8
                  }
                  className={cn(
                    'shrink-0 transition-transform duration-200',
                    !active &&
                      'group-hover:scale-105'
                  )}
                />

                {!collapsed && (
                  <span className="truncate">
                    {link.label}
                  </span>
                )}

              </Link>
            )
          })}

        </nav>

      </div>

      {/* =====================================================
          ESPACE PORTFOLIO
          ===================================================== */}

      {!collapsed && (
        <div className="mx-4 mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-3">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D6A62C]/15 text-[#D6A62C]">
              <Wallet size={15} />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-wider text-white/35">
                Investissement
              </p>

              <p className="mt-0.5 truncate text-[11px] font-semibold text-white/75">
                Gérez votre portefeuille
              </p>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ESPACE FLEXIBLE
          ===================================================== */}

      <div className="flex-1" />

      {/* =====================================================
          UTILISATEUR
          ===================================================== */}

      <div className="border-t border-white/10 p-4">

        {!collapsed && userEmail && (
          <div className="mb-3 flex items-center gap-2.5 rounded-xl bg-white/[0.045] p-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/70">
              <CircleUserRound size={16} />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] font-bold uppercase tracking-wider text-white/35">
                Compte
              </p>

              <p className="truncate text-[10px] font-medium text-white/70">
                {userEmail}
              </p>

            </div>

          </div>
        )}

        {/* DÉCONNEXION */}

        <button
          type="button"
          onClick={logout}
          title={
            collapsed
              ? 'Déconnexion'
              : undefined
          }
          className={cn(
            `
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-sm
            font-medium
            text-white/50
            transition-all
            hover:bg-red-500/10
            hover:text-red-300
            `,
            collapsed &&
              'justify-center'
          )}
        >

          <LogOut
            size={17}
            strokeWidth={1.8}
            className="shrink-0 transition-transform group-hover:translate-x-0.5"
          />

          {!collapsed && (
            <span>
              Déconnexion
            </span>
          )}

        </button>

        {/* RÉDUIRE */}

        <button
          type="button"
          onClick={() =>
            setCollapsed(
              (value) => !value
            )
          }
          className={cn(
            `
            mt-2
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-white/35
            transition-all
            hover:bg-white/[0.06]
            hover:text-white/70
            `,
            collapsed &&
              'justify-center'
          )}
        >

          {collapsed ? (
            <ChevronRight
              size={17}
            />
          ) : (
            <ChevronLeft
              size={17}
            />
          )}

          {!collapsed && (
            <span className="text-[11px] font-medium">
              Réduire le menu
            </span>
          )}

        </button>

      </div>

    </aside>
  )
}