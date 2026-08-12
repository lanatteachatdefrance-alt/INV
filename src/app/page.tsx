'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/GlassCard'
import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui/Buttons'
import { PerformanceChart } from '@/components/fintech/PerformanceChart'

import { createClient } from '@/utils/supabase/client'

type InvestmentOffer = {
  id?: string
  title?: string | null
  company_name?: string | null
  symbol?: string | null
  type?: string | null
  sector?: string | null
  currency?: string | null

  price_per_share?: number | string | null
  previous_price?: number | string | null

  volume?: number | string | null
  variation_number?: number | string | null

  is_active?: boolean | null
  last_updated?: string | null
}

type MarketStock = {
  ticker: string
  name: string
  cours: number
  variation: number
  volume: number
}

export default function Home() {
  const [stocks, setStocks] = useState<MarketStock[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function getMarketData() {
    try {
      setLoading(true)
      setErrorMessage(null)

      const supabase = createClient()

      const { data, error } = await supabase
        .from('investment_offers')
        .select('*')
        .eq('is_active', true)
        .limit(100)

      if (error) {
        console.error(
          'Erreur Supabase investment_offers:',
          error
        )

        setErrorMessage(
          `Erreur Supabase : ${error.message}`
        )

        setStocks([])
        return
      }

      console.log('DONNEES SUPABASE :', data)

      const offers = (data || []) as InvestmentOffer[]

      const formattedStocks: MarketStock[] = offers
        .map((offer) => {
          const price = Number(
            offer.price_per_share ?? 0
          )

          const previousPrice = Number(
            offer.previous_price ?? 0
          )

          let variation = Number(
            offer.variation_number ?? 0
          )

          // Calcul de la variation si nécessaire
          if (
            variation === 0 &&
            previousPrice > 0 &&
            price > 0
          ) {
            variation =
              ((price - previousPrice) /
                previousPrice) *
              100
          }

          return {
            ticker:
              offer.symbol ||
              offer.title ||
              'N/A',

            name:
              offer.company_name ||
              offer.title ||
              'Valeur BRVM',

            cours: price,

            variation: Number(
              variation.toFixed(2)
            ),

            volume: Number(
              offer.volume ?? 0
            ),
          }
        })
        .filter(
          (stock) =>
            stock.ticker !== 'N/A' &&
            stock.cours > 0
        )

      // Les valeurs avec le plus gros volume
      formattedStocks.sort(
        (a, b) => b.volume - a.volume
      )

      setStocks(formattedStocks)
    } catch (error) {
      console.error(
        'Erreur récupération marché :',
        error
      )

      setErrorMessage(
        'Impossible de récupérer les données du marché.'
      )

      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial
  useEffect(() => {
    getMarketData()
  }, [])

  // Top 3 valeurs
  const topActive = stocks.slice(0, 3)

  // Valeur moyenne des cours
  const marketAverage =
    stocks.length > 0
      ? stocks.reduce(
          (total, stock) =>
            total + stock.cours,
          0
        ) / stocks.length
      : 0

  // Données du graphique
  const chartData = stocks
    .slice(0, 20)
    .map((stock) => ({
      label: stock.ticker,
      value: stock.cours,
    }))

  return (
    <div className="fin-page fin-section">

      {/* =========================
          BLOC PRINCIPAL
      ========================== */}

      <GlassCard
        hover={false}
        className="relative overflow-hidden bg-card-shine"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-fin-primary/10 via-transparent to-fin-success/10 pointer-events-none" />

        <div className="relative max-w-2xl">

          <p className="text-fin-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Investir Bourse
          </p>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-slate-900">
            Investissez avec la précision d&apos;une banque digitale
          </h1>

          <p className="text-fin-mute mt-4 text-sm md:text-base max-w-lg">
            Portefeuille, marché BRVM et ordres —
            une expérience premium pensée pour
            le mobile et le desktop.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">

            <Link href="/register">
              <PrimaryButton
                size="lg"
                className="w-full sm:w-auto"
              >
                Ouvrir un compte
                <ArrowRight size={16} />
              </PrimaryButton>
            </Link>

            <Link href="/login">
              <SecondaryButton
                size="lg"
                className="w-full sm:w-auto"
              >
                Se connecter
              </SecondaryButton>
            </Link>

          </div>
        </div>
      </GlassCard>


      {/* =========================
          MARCHE BRVM
      ========================== */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* GRAPHIQUE */}

        <div className="lg:col-span-3">

          {loading ? (

            <GlassCard
              hover={false}
              className="min-h-[350px] flex items-center justify-center"
            >
              <div className="flex items-center gap-3 text-fin-mute">

                <RefreshCw
                  size={20}
                  className="animate-spin"
                />

                Chargement des données du marché...

              </div>
            </GlassCard>

          ) : errorMessage ? (

            <GlassCard
              hover={false}
              className="min-h-[350px] flex items-center justify-center"
            >
              <div className="text-center px-6">

                <p className="font-bold text-red-500 mb-2">
                  Erreur de chargement
                </p>

                <p className="text-sm text-fin-mute">
                  {errorMessage}
                </p>

                <button
                  onClick={getMarketData}
                  className="mt-5 px-4 py-2 rounded-lg bg-fin-primary text-white text-sm font-semibold"
                >
                  Réessayer
                </button>

              </div>
            </GlassCard>

          ) : stocks.length === 0 ? (

            <GlassCard
              hover={false}
              className="min-h-[350px] flex items-center justify-center"
            >
              <div className="text-center px-6">

                <p className="font-bold text-slate-900">
                  Aucune valeur disponible
                </p>

                <p className="text-sm text-fin-mute mt-2">
                  Aucune donnée active n&apos;a été
                  trouvée dans investment_offers.
                </p>

                <button
                  onClick={getMarketData}
                  className="mt-5 px-4 py-2 rounded-lg bg-fin-primary text-white text-sm font-semibold"
                >
                  Actualiser
                </button>

              </div>
            </GlassCard>

          ) : (

            <PerformanceChart
              title="MARCHÉ BRVM"
              value={marketAverage}
              changePct={
                topActive[0]?.variation ?? 0
              }
              data={chartData}
              subtitle="Données provenant de Supabase"
              volume={`${stocks.length} valeurs`}
            />

          )}

        </div>


        {/* =========================
            TOP ACTIFS
        ========================== */}

        <div className="lg:col-span-2">

          <GlassCard
            padding="none"
            hover={false}
          >

            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-200">

              <h2 className="font-bold flex items-center gap-2 text-slate-900">

                <TrendingUp
                  size={16}
                  className="text-fin-success"
                />

                Top actifs

              </h2>

              <button
                onClick={getMarketData}
                title="Actualiser"
                className="p-2 rounded-lg hover:bg-slate-100"
              >

                <RefreshCw size={15} />

              </button>

            </div>


            {loading ? (

              <div className="px-5 py-10 text-center text-sm text-fin-mute">
                Chargement...
              </div>

            ) : topActive.length === 0 ? (

              <div className="px-5 py-10 text-center text-sm text-fin-mute">
                Aucune donnée disponible.
              </div>

            ) : (

              <div className="divide-y divide-slate-200">

                {topActive.map((stock) => (

                  <div
                    key={stock.ticker}
                    className="px-5 py-3.5 flex items-center justify-between gap-3"
                  >

                    <div>

                      <p className="font-semibold text-sm text-slate-900">
                        {stock.ticker}
                      </p>

                      <p className="text-[11px] text-fin-mute">
                        {stock.name}
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-sm font-semibold text-slate-900">
                        {stock.cours.toLocaleString(
                          'fr-FR'
                        )}{' '}
                        FCFA
                      </p>

                      <p
                        className={`text-xs font-semibold ${
                          stock.variation >= 0
                            ? 'text-fin-success'
                            : 'text-fin-danger'
                        }`}
                      >
                        {stock.variation >= 0
                          ? '+'
                          : ''}

                        {stock.variation.toFixed(
                          2
                        )}
                        %

                      </p>

                    </div>

                  </div>

                ))}

              </div>

            )}


            <Link
              href="/register"
              className="flex items-center justify-center gap-1 py-3.5 text-xs font-bold text-fin-primary border-t border-slate-200 hover:bg-slate-50"
            >
              Commencer à investir
              <ArrowUpRight size={14} />
            </Link>

          </GlassCard>

        </div>

      </div>


      {/* =========================
          INFORMATIONS
      ========================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <GlassCard padding="md">

          <h3 className="font-bold mb-1.5">
            Exécution claire
          </h3>

          <p className="text-sm text-fin-mute leading-relaxed">
            Ordres, statuts et historique lisibles
            en un coup d’œil.
          </p>

        </GlassCard>


        <GlassCard padding="md">

          <h3 className="font-bold mb-1.5">
            Portefeuille live
          </h3>

          <p className="text-sm text-fin-mute leading-relaxed">
            Solde, valorisation et performance
            avec animations fluides.
          </p>

        </GlassCard>


        <GlassCard padding="md">

          <h3 className="font-bold mb-1.5">
            Mobile-first
          </h3>

          <p className="text-sm text-fin-mute leading-relaxed">
            Installez l’app sur votre écran
            d’accueil en un geste.
          </p>

        </GlassCard>

      </div>

    </div>
  )
}