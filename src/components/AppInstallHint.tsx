'use client'

import { useEffect, useState } from 'react'
import { Share, X } from 'lucide-react'

export default function AppInstallHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) return
    if (sessionStorage.getItem('ib-install-hint')) return
    if (!window.matchMedia('(max-width: 767px)').matches) return
    const t = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      className="md:hidden fixed inset-x-3 z-[70] rounded-[20px] bg-fin-card border border-white/10 text-white shadow-glass p-4"
      style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center font-black text-sm">
          IB
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Installer l&apos;app</p>
          <p className="text-fin-mute text-xs mt-1 leading-relaxed">
            iPhone : Safari → <Share className="inline w-3.5 h-3.5 mx-0.5" /> → Sur l&apos;écran d&apos;accueil.
            Android : menu → Installer l&apos;application.
          </p>
        </div>
        <button
          type="button"
          aria-label="Fermer"
          onClick={() => {
            sessionStorage.setItem('ib-install-hint', '1')
            setVisible(false)
          }}
          className="p-1.5 rounded-lg text-fin-mute hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
