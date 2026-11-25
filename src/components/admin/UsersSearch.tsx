'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AdminUserActions } from '@/components/admin/AdminUserActions'

type Profile = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  role: string | null
  kyc_status: string | null
  balance: number | null
}

export default function UsersSearch({
  profiles,
}: {
  profiles: Profile[]
}) {
  const [search, setSearch] = useState('')

  const filteredProfiles = useMemo(() => {
    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
    const query = normalize(search.trim())

    if (!query) return profiles

    return profiles.filter((profile) => {
      const fullName = [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(' ')

      return normalize(`${fullName} ${profile.email ?? ''}`).includes(query)
    })
  }, [profiles, search])

  return (
    <section aria-labelledby="client-list-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="client-list-title" className="text-lg font-semibold text-slate-900">
          Comptes clients
        </h2>

        <div className="relative w-full sm:max-w-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un client par nom ou adresse e-mail"
            placeholder="Nom ou e-mail du client..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#d6a62c] focus:ring-2 focus:ring-[#d6a62c]/20"
          />

          <svg
            className="absolute left-3 top-3 h-4 w-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {filteredProfiles.length} client(s) trouvé(s)
        {search.trim() ? ` pour « ${search.trim()} »` : ''}
      </p>

      <div className="mt-4 grid gap-4">
        {filteredProfiles.map((profile) => (
          <article
            key={profile.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="break-words font-semibold text-slate-900">
                  {profile.email || 'E-mail non renseigné'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {[profile.first_name, profile.last_name]
                    .filter(Boolean)
                    .join(' ') || 'Nom non renseigné'}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <p>
                  KYC :{' '}
                  <span className="font-semibold text-slate-900">
                    {profile.kyc_status || 'en_attente'}
                  </span>
                </p>
                <p>
                  Solde :{' '}
                  <span className="font-semibold text-slate-900">
                    {Number(profile.balance ?? 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-1">
              <AdminUserActions profile={{ ...profile, email: profile.email ?? '' }} />
              <div className="mt-3 border-t border-slate-100 pt-3">
                <Link
                  href={`/admin/clients/${profile.id}/statement`}
                  className="inline-flex items-center justify-center rounded-lg bg-[#061B31] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#123653]"
                >
                  Voir le relevé
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              {profiles.length === 0
                ? 'Aucun utilisateur trouvé.'
                : 'Aucun client ne correspond à votre recherche.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}