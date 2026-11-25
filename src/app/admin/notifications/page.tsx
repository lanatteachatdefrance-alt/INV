import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ensureAdminAccess } from '@/lib/admin'
import BroadcastNotificationForm from '@/components/admin/BroadcastNotificationForm'

export const dynamic = 'force-dynamic'

export default async function AdminNotificationsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!(await ensureAdminAccess(supabase, user))) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A77C12]">Administration</p>
          <h1 className="mt-1 text-2xl font-black text-[#061B31]">Notifications push</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Envoyez une information aux appareils Web Push et Android (FCM) qui se sont abonnés aux notifications.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            Seuls les administrateurs peuvent diffuser un message. Les personnes ayant refusé les notifications ou n’ayant pas enregistré d’appareil ne le recevront pas.
          </div>
          <BroadcastNotificationForm />
        </section>
      </div>
    </main>
  )
}