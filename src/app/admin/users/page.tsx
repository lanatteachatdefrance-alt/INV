import { createClient } from '@/utils/supabase/server'
import { validateKyc } from '@/app/admin/actions'
import { CheckCircle, ShieldCheck, User } from 'lucide-react'
import RechargeClientForm from './RechargeClientForm'

export default async function AdminUsers() {
  const supabase = createClient()
  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false })

  return (
    <div className="app-page md:p-8 max-w-7xl mx-auto">
      <main className="flex-1">
        <h1 className="hidden md:block text-3xl font-black mb-2 text-brand-dark">Gestion des Clients</h1>
        <p className="text-gray-500 text-sm font-medium mb-4 md:mb-8">
          Consultez les inscrits, validez les KYC et gérez les portefeuilles.
        </p>

        <div className="flex justify-between items-center mb-4 md:mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="w-full md:w-1/3 px-4 py-3.5 md:py-2 rounded-2xl md:rounded-lg border border-gray-200 md:border-gray-300 bg-white shadow-sm focus:outline-none focus:border-brand text-base"
          />
        </div>

        {/* Mobile card list */}
        <div className="md:hidden flex flex-col gap-3 mb-4">
          {(users || []).map((u) => (
            <div key={u.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="font-black text-brand-dark truncate">
                    {u.first_name} {u.last_name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${
                    u.kyc_status === 'validé' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {u.kyc_status || 'en_attente'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500 font-medium">Solde</span>
                <span className="font-black text-brand-dark">
                  {parseFloat(u.balance || 0).toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {u.kyc_status !== 'validé' && (
                  <form
                    action={async () => {
                      'use server'
                      await validateKyc(u.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-brand-dark text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={14} /> Valider KYC
                    </button>
                  </form>
                )}
                <RechargeClientForm
                  userId={u.id}
                  userName={`${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Client'}
                  currentBalance={parseFloat(u.balance || 0)}
                />
              </div>
            </div>
          ))}
          {(!users || users.length === 0) && (
            <div className="p-10 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
              <User size={40} className="mx-auto mb-3 opacity-20" />
              Aucun utilisateur inscrit.
            </div>
          )}
        </div>

        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Client</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Rôle</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Statut KYC</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px]">Solde</th>
                <th className="p-4 font-bold text-gray-500 uppercase tracking-widest text-[10px] text-right">
                  Actions Rapides
                </th>
              </tr>
            </thead>
            <tbody>
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                    <User size={48} className="mx-auto mb-4 opacity-20" />
                    Aucun utilisateur inscrit.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {user.email || `ID: ${user.id.split('-')[0]}...`}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.role === 'admin' ? (
                        <span className="bg-red-100 text-red-600 font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-brand font-black text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                          Client
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.kyc_status === 'validé' ? (
                        <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 w-max px-2 py-1 rounded text-xs">
                          <CheckCircle size={14} /> Approuvé
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 w-max px-2 py-1 rounded text-xs">
                          <ShieldCheck size={14} /> En attente
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-black text-gray-800">
                      {parseFloat(user.balance || 0).toLocaleString('fr-FR')}{' '}
                      <span className="text-[10px] text-gray-500 font-bold">FCFA</span>
                    </td>
                    <td className="p-4 flex flex-col md:flex-row justify-end gap-2 md:items-center">
                      {user.kyc_status !== 'validé' && (
                        <form
                          action={async () => {
                            'use server'
                            await validateKyc(user.id)
                          }}
                        >
                          <button
                            type="submit"
                            className="bg-white hover:bg-green-50 text-green-600 font-bold text-xs py-1.5 px-3 rounded border border-gray-200 hover:border-green-200 shadow-sm transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={14} /> Valider KYC
                          </button>
                        </form>
                      )}

                      <RechargeClientForm
                        userId={user.id}
                        userName={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Client'}
                        currentBalance={parseFloat(user.balance || 0)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
