'use client'

import { useMemo, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react'

import { InvestmentCard } from '@/components/fintech/InvestmentCard'

type InvestmentOffer = {
  id: string
  title: string | null
  symbol: string | null
  description: string | null
  type: string | null
  roi_percentage: number | string | null
  price_per_share: number | string | null
  minimum_investment: number | string | null
  company_name: string | null
}

type InvestmentCardOffer = {
  id: string
  title: string
  symbol?: string
  description?: string
  type?: string
  roi_percentage?: number
  price_per_share: number
  minimum_investment?: number
}

type SortOption =
  | 'az'
  | 'za'
  | 'priceAsc'
  | 'priceDesc'
  | 'variationAsc'
  | 'variationDesc'

type MarketFiltersProps = {
  offers: InvestmentOffer[]
  userBalance: number
  isKycValid: boolean
  onBuy: (
    offerId: string,
    shares: number
  ) => Promise<{ error?: string } | void>
}

export default function MarketFilters({
  offers,
  userBalance,
  isKycValid,
  onBuy,
}: MarketFiltersProps) {
  const [search, setSearch] = useState('')

  const [sort, setSort] =
    useState<SortOption>('az')

  // =========================
  // NORMALISATION
  // =========================

  const normalizedOffers = useMemo<
    InvestmentCardOffer[]
  >(() => {
    return offers
      .map((offer) => {
        const title =
          offer.title?.trim() ||
          offer.company_name?.trim() ||
          offer.symbol?.trim() ||
          'Valeur BRVM'

        const symbol =
          offer.symbol?.trim() || ''

        const description =
          offer.description?.trim() || ''

        const type =
          offer.type?.trim() || 'Action'

        const roi =
          Number(
            offer.roi_percentage ?? 0
          )

        const price =
          Number(
            offer.price_per_share ?? 0
          )

        const minimum =
          Number(
            offer.minimum_investment ?? 0
          )

        return {
          id: offer.id,
          title,
          symbol,
          description,
          type,

          roi_percentage:
            Number.isFinite(roi)
              ? roi
              : 0,

          price_per_share:
            Number.isFinite(price)
              ? price
              : 0,

          minimum_investment:
            Number.isFinite(minimum)
              ? minimum
              : 0,
        }
      })
      .filter(
        (offer) =>
          offer.id &&
          offer.price_per_share > 0
      )
  }, [offers])

  // =========================
  // RECHERCHE + TRI
  // =========================

  const filteredOffers = useMemo(() => {
    const query =
      search.trim().toLowerCase()

    let result =
      normalizedOffers.filter(
        (offer) => {
          if (!query) {
            return true
          }

          const title =
            offer.title.toLowerCase()

          const symbol =
            offer.symbol?.toLowerCase() ||
            ''

          const description =
            offer.description?.toLowerCase() ||
            ''

          const type =
            offer.type?.toLowerCase() ||
            ''

          return (
            title.includes(query) ||
            symbol.includes(query) ||
            description.includes(query) ||
            type.includes(query)
          )
        }
      )

    result = [...result].sort(
      (a, b) => {
        const nameA =
          a.title
            .trim()
            .toLowerCase()

        const nameB =
          b.title
            .trim()
            .toLowerCase()

        const priceA =
          Number(
            a.price_per_share
          )

        const priceB =
          Number(
            b.price_per_share
          )

        const variationA =
          Number(
            a.roi_percentage ?? 0
          )

        const variationB =
          Number(
            b.roi_percentage ?? 0
          )

        switch (sort) {
          case 'az':
            return nameA.localeCompare(
              nameB,
              'fr',
              {
                sensitivity: 'base',
              }
            )

          case 'za':
            return nameB.localeCompare(
              nameA,
              'fr',
              {
                sensitivity: 'base',
              }
            )

          case 'priceAsc':
            return priceA - priceB

          case 'priceDesc':
            return priceB - priceA

          case 'variationAsc':
            return (
              variationA -
              variationB
            )

          case 'variationDesc':
            return (
              variationB -
              variationA
            )

          default:
            return nameA.localeCompare(
              nameB,
              'fr',
              {
                sensitivity: 'base',
              }
            )
        }
      }
    )

    return result
  }, [
    normalizedOffers,
    search,
    sort,
  ])

  return (
    <div className="space-y-5">

      {/* =========================
          EN-TÊTE
      ========================== */}

      <div className="flex flex-col gap-1">

        <div className="flex items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Valeurs disponibles
            </h2>

            <p className="text-sm text-slate-500">
              {filteredOffers.length}{' '}
              {filteredOffers.length > 1
                ? 'valeurs'
                : 'valeur'}{' '}
              affichée
              {filteredOffers.length > 1
                ? 's'
                : ''}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">

            <SlidersHorizontal
              size={14}
            />

            Marché BRVM

          </div>

        </div>

      </div>

      {/* =========================
          RECHERCHE
      ========================== */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Rechercher une valeur, une société ou un symbole..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* =========================
          TRI
      ========================== */}

      <div className="flex items-center justify-end">

        <div className="flex items-center gap-2">

          <ArrowUpDown
            size={16}
            className="text-slate-400 shrink-0"
          />

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as SortOption
              )
            }
            className="w-full lg:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >

            <option value="az">
              A → Z
            </option>

            <option value="za">
              Z → A
            </option>

            <option value="priceAsc">
              Cours : croissant
            </option>

            <option value="priceDesc">
              Cours : décroissant
            </option>

            <option value="variationAsc">
              Rendement : croissant
            </option>

            <option value="variationDesc">
              Rendement : décroissant
            </option>

          </select>

        </div>

      </div>

      {/* =========================
          AUCUN RÉSULTAT
      ========================== */}

      {filteredOffers.length === 0 ? (

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">

            <Search
              size={20}
              className="text-slate-400"
            />

          </div>

          <h3 className="font-bold text-slate-900">
            Aucune valeur trouvée
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Essayez un autre nom ou symbole.
          </p>

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch('')
              }
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Réinitialiser la recherche
            </button>
          )}

        </div>

      ) : (

        /* =========================
           CARTES
        ========================== */

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filteredOffers.map(
            (offer) => (

              <InvestmentCard
                key={offer.id}
                offer={offer}
                userBalance={
                  userBalance
                }
                isKycValid={
                  isKycValid
                }
                onBuy={onBuy}
              />

            )
          )}

        </div>

      )}

    </div>
  )
}