import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 })

    const { data } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, address, nationality, kyc_status, created_at')
      .eq('id', user.id)
      .single()

    return Response.json({ user: data })
  } catch (error) {
    console.error('API GET /api/user/profile error', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return Response.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const updates: Record<string, any> = {}
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.address !== undefined) updates.address = body.address
    if (body.first_name !== undefined) updates.first_name = body.first_name
    if (body.last_name !== undefined) updates.last_name = body.last_name

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select('id, email, first_name, last_name, phone, address, nationality, kyc_status, created_at')
      .single()

    if (error) throw error

    return Response.json({ user: data })
  } catch (error) {
    console.error('API PATCH /api/user/profile error', error)
    return Response.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}
