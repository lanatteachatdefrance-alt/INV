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

  // Pages qui ont leur propre design
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password'

  // =====================================================
  // PAGES AUTHENTIFICATION
  // Aucun Navbar / Sidebar / BottomNav
  // =====================================================

  if (isAuthPage) {
    return (
      <main className="w-full min-w-0">
        {children}
      </main>
    )
  }

  // =====================================================
  // APPLICATION
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

        {/* CONTENU */}

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

      {/* NAVIGATION MOBILE
          UNIQUEMENT SI L'UTILISATEUR EST CONNECTÉ */}

      {isLoggedIn && (
        <MobileBottomNav
          isLoggedIn={true}
          isAdmin={isAdmin}
        />
      )}
    </>
  )
}