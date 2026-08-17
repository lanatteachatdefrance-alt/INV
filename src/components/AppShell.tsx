'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import { Sidebar } from '@/components/Sidebar'

type AppShellProps = {
  children: React.ReactNode
  isLoggedIn: boolean
  isAdmin: boolean
  userEmail?: string
}

export default function AppShell({
  children,
  isLoggedIn,
  isAdmin,
  userEmail,
}: AppShellProps) {
  const pathname = usePathname() || '/'

  // =====================================================
  // PAGES D'AUTHENTIFICATION
  // =====================================================

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password'

  // =====================================================
  // AUTH : PAS DE NAVBAR / SIDEBAR / BOTTOM NAV
  // =====================================================

  if (isAuthPage) {
    return (
      <main className="w-full min-w-0">
        {children}
      </main>
    )
  }

  // =====================================================
  // APPLICATION NORMALE
  // =====================================================

  return (
    <>
      <div className="flex min-h-[100dvh] w-full min-w-0 overflow-x-hidden">

        {/* SIDEBAR DESKTOP */}

        {isLoggedIn && (
          <Sidebar
            isAdmin={isAdmin}
            userEmail={userEmail}
          />
        )}

        {/* ZONE PRINCIPALE */}

        <div className="flex min-h-[100dvh] min-w-0 flex-1 flex-col overflow-x-hidden">

          <Navbar
            userEmail={userEmail}
          />

          <main
            className="
              w-full
              min-w-0
              flex-1
              mx-0
              pb-[calc(5.75rem+env(safe-area-inset-bottom))]
              lg:mx-auto
              lg:max-w-[1400px]
              lg:pb-8
            "
          >
            {children}
          </main>

        </div>
      </div>

      {/* NAVIGATION MOBILE */}

      <MobileBottomNav
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />
    </>
  )
}