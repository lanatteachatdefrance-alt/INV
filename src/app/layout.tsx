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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    isAdmin = await ensureAdminAccess(supabase, user)
  }

  const showSidebar = !!user

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-fin-bg text-fin-text min-h-[100dvh] antialiased`}>
        <div className="flex min-h-[100dvh]">
          {showSidebar && <Sidebar isAdmin={isAdmin} userEmail={user?.email} />}

          <div className="flex-1 flex flex-col min-w-0">
            <Navbar userEmail={user?.email} />

            <main className="flex-1 w-full max-w-[1400px] mx-auto pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-8">
              {children}
            </main>
          </div>
        </div>

        <MobileBottomNav isLoggedIn={!!user} isAdmin={isAdmin} />
        <AppInstallHint />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
