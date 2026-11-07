'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

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
    const query = search.trim().toLowerCase()

    if (!query) return profiles

    return profiles.filter((profile) => {
      const fullName = [
        profile.first_name,
        profile.last_name,
      ].filter(Boolean).join(' ')

      return [
        fullName,
        profile.first_name,
        profile.last_name,
        profile.email,
        profile.id,
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    })
  }, [profiles, search])

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Comptes clients
        </h2>

        <div className="relative w-full sm:max-w-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
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
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Nom</th>
              <th className="py-2 pr-4">Rôle</th>
              <th className="py-2 pr-4">KYC</th>
              <th className="py-2 pr-4">Solde</th>
              <th className="py-2">Relevé</th>
            </tr>
          </thead>

          <tbody>
            {filteredProfiles.map((profile) => (
              <tr
                key={profile.id}
                className="border-t border-slate-100"
              >
                <td className="py-3 pr-4">
                  {profile.email || '—'}
                </td>

                <td className="py-3 pr-4">
                  {[profile.first_name, profile.last_name]
                    .filter(Boolean)
                    .join(' ') || '—'}
                </td>

                <td className="py-3 pr-4">
                  {profile.role || '—'}
                </td>

                <td className="py-3 pr-4">
                  {profile.kyc_status || 'en_attente'}
                </td>

                <td className="py-3 pr-4 whitespace-nowrap">
                  {Number(profile.balance ?? 0).toLocaleString('fr-FR')} FCFA
                </td>

                <td className="py-3 whitespace-nowrap">
                  <Link
                    href={`/admin/clients/${profile.id}/statement`}
                    className="font-medium text-[#14283b] hover:text-[#d6a62c]"
                  >
                    Voir le relevé
                  </Link>
                </td>
              </tr>
            ))}

            {filteredProfiles.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-500"
                >
                  Aucun client ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}