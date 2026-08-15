'use client'

import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#eef5ff]
      "
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Fond légèrement bleu */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fbff] via-[#eef5ff] to-[#e5efff]" />

      {/* Halo central très léger */}
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center">

        <img
          src="/ICONE.jpeg"
          alt="Invictus Capital & Finance"
          className="
            h-56
            w-56
            object-contain
            sm:h-64
            sm:w-64
          "
        />

        {/* Chargement */}
        <div className="mt-8 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#1455d9]" />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-[#1455d9]"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-[#1455d9]"
            style={{ animationDelay: '300ms' }}
          />
        </div>

        <p className="mt-5 text-[10px] font-semibold tracking-[0.35em] text-[#64748b]">
          INVESTIR AUJOURD’HUI
        </p>

      </div>
    </div>
  )
}