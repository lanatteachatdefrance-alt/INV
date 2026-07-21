'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton, SecondaryButton } from '@/components/ui/Buttons'
import { PerformanceChart } from '@/components/fintech/PerformanceChart'

export default function Home() {
  const [indice, setIndice] = useState(228.45)
  const [topActive, setTopActive] = useState([
    { ticker: 'SNTS', name: 'SONATEL SN', cours: 32450, var: 1.2 },
    { ticker: 'ORAC', name: 'ORANGE CI', cours: 16165, var: 0.85 },
    { ticker: 'SGBC', name: 'SG CI', cours: 38200, var: 0.5 },
  ])

  useEffect(() => {
    const id = setInterval(() => {
      setIndice((v) => +(v + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2))
      setTopActive((prev) =>
        prev.map((s) => ({
          ...s,
          cours: Math.max(1, s.cours + (Math.random() > 0.5 ? 15 : -10)),
          var: +(s.var + (Math.random() > 0.5 ? 0.03 : -0.03)).toFixed(2),
        }))
      )
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const chartData = Array.from({ length: 20 }, (_, i) => ({
    label: `${i}`,
    value: 220 + Math.sin(i / 2) * 8 + i * 0.4,
  }))

  return (
    <div className="fin-page fin-section">
      <GlassCard hover={false} className="relative overflow-hidden bg-card-shine">
        <div className="absolute inset-0 bg-gradient-to-br from-fin-primary/10 via-transparent to-fin-success/10 pointer-events-none" />
        <div className="relative max-w-2xl">
          <p className="text-fin-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Investir Bourse</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-slate-900">
            Investissez avec la précision d&apos;une banque digitale
          </h1>
          <p className="text-fin-mute mt-4 text-sm md:text-base max-w-lg">
            Portefeuille, marché BRVM et ordres — une expérience premium pensée pour le mobile et le desktop.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/register">
              <PrimaryButton size="lg" className="w-full sm:w-auto">
                Ouvrir un compte <ArrowRight size={16} />
              </PrimaryButton>
            </Link>
            <Link href="/login">
              <SecondaryButton size="lg" className="w-full sm:w-auto">
                Se connecter
              </SecondaryButton>
            </Link>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <PerformanceChart
            title="IB COMPOSITE"
            value={indice}
            changePct={indice >= 228 ? 0.34 : -0.34}
            data={chartData}
            subtitle="Indice simulé en direct"
            volume="Marché régional"
          />
        </div>
        <div className="lg:col-span-2">
          <GlassCard padding="none" hover={false}>
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-200">
              <h2 className="font-bold flex items-center gap-2 text-slate-900">
                <TrendingUp size={16} className="text-fin-success" /> Top actifs
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {topActive.map((s) => (
                <div key={s.ticker} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{s.ticker}</p>
                    <p className="text-[11px] text-fin-mute">{s.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{s.cours.toLocaleString('fr-FR')} FCFA</p>
                    <p className={`text-xs font-semibold ${s.var >= 0 ? 'text-fin-success' : 'text-fin-danger'}`}>
                      {s.var >= 0 ? '+' : ''}
                      {s.var}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/register"
              className="flex items-center justify-center gap-1 py-3.5 text-xs font-bold text-fin-primary border-t border-slate-200 hover:bg-slate-50"
            >
              Commencer à investir <ArrowUpRight size={14} />
            </Link>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { t: 'Exécution claire', d: 'Ordres, statuts et historique lisibles en un coup d’œil.' },
          { t: 'Portefeuille live', d: 'Solde, valorisation et performance avec animations fluides.' },
          { t: 'Mobile-first', d: 'Installez l’app sur votre écran d’accueil en un geste.' },
        ].map((f) => (
          <GlassCard key={f.t} padding="md">
            <TrendingDown className="text-fin-primary mb-3 opacity-0 absolute" />
            <h3 className="font-bold mb-1.5">{f.t}</h3>
            <p className="text-sm text-fin-mute leading-relaxed">{f.d}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
