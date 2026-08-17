import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ensureAdminAccess } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

import AppInstallHint from '@/components/AppInstallHint'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import SplashScreen from '@/components/SplashScreen'
import AppShell from '@/components/AppShell'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Investir Bourse',
  description: 'Plateforme d’investissement boursier.',
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
            ÉCRAN DE CHARGEMENT
            ===================================================== */}

        <SplashScreen />

        {/* =====================================================
            APPLICATION
            ===================================================== */}

        <AppShell
          isLoggedIn={!!user}
          isAdmin={isAdmin}
          userEmail={user?.email}
        >
          {children}
        </AppShell>

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