import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ensureAdminAccess } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

import Navbar from '@/components/Navbar'
import MobileBottomNav from '@/components/MobileBottomNav'
import AppInstallHint from '@/components/AppInstallHint'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Investir Bourse',
  description: 'Plateforme premium d’investissement boursier.',
  applicationName: 'Investir Bourse',

  manifest: '/manifest.webmanifest',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IB Bourse',
  },

  formatDetection: {
    telephone: false,
  },

  icons: {
    icon: [
      {
        url: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

  // Permet à l'application d'utiliser toute la surface
  // disponible sur les téléphones avec encoche/barre système.
  viewportFit: 'cover',

  themeColor: '#FFFFFF',

  colorScheme: 'light',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false

  if (user) {
    isAdmin = await ensureAdminAccess(
      supabase,
      user
    )
  }

  const showSidebar = !!user

  return (
    <html
      lang="fr"
      className="scroll-smooth"
    >
      <body
        className={`
          ${inter.className}
          bg-fin-bg
          text-fin-text
          antialiased
          w-full
          min-w-0
          min-h-[100dvh]
          overflow-x-hidden
        `}
      >
        {/* =====================================================
            CONTENEUR PRINCIPAL DE L'APPLICATION
            ===================================================== */}

        <div
          className="
            flex
            min-h-[100dvh]
            w-full
            min-w-0
            overflow-x-hidden
          "
        >

          {/* =====================================================
              SIDEBAR DESKTOP
              ===================================================== */}

          {showSidebar && (
            <Sidebar
              isAdmin={isAdmin}
              userEmail={user?.email}
            />
          )}

          {/* =====================================================
              ZONE PRINCIPALE
              ===================================================== */}

          <div
            className="
              flex
              min-h-[100dvh]
              min-w-0
              flex-1
              flex-col
              overflow-x-hidden
            "
          >

            {/* ===================================================
                NAVBAR
                =================================================== */}

            <Navbar
              userEmail={user?.email}
            />

            {/* ===================================================
                CONTENU
                =================================================== */}

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

        {/* =====================================================
            NAVIGATION MOBILE
            ===================================================== */}

        <MobileBottomNav
          isLoggedIn={!!user}
          isAdmin={isAdmin}
        />

        {/* =====================================================
            INSTALLATION PWA
            ===================================================== */}

        <AppInstallHint />

        {/* =====================================================
            SERVICE WORKER
            ===================================================== */}

        <ServiceWorkerRegister />

      </body>
    </html>
  )
}