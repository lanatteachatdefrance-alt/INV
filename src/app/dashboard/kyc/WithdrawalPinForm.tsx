'use client'

import { useState } from 'react'

export default function WithdrawalPinForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>
}) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-5">
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl bg-[#061B31] px-4 py-3 text-sm font-bold text-white hover:bg-[#0A2948]"
        >
          Configurer mon code PIN
        </button>
      ) : (
        <form action={action} className="space-y-5">
          <div>
            <label htmlFor="pin" className="text-sm font-semibold text-slate-600">
              Nouveau code PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 6)
              }}
              placeholder="6 chiffres"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center tracking-[0.5em]"
            />
          </div>

          <div>
            <label htmlFor="confirmPin" className="text-sm font-semibold text-slate-600">
              Confirmer le code PIN
            </label>
            <input
              id="confirmPin"
              name="confirmPin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 6)
              }}
              placeholder="Répétez les 6 chiffres"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center tracking-[0.5em]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#061B31] px-4 py-3 font-bold text-white hover:bg-[#0A2948]"
          >
            Enregistrer
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-600"
          >
            Annuler
          </button>
        </form>
      )}
    </div>
  )
}