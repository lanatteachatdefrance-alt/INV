import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next')

  const destination =
    next && next.startsWith('/') && !next.startsWith('//')
      ? next
      : '/reset-password'

  if (!code) {
    return NextResponse.redirect(
      new URL('/forgot-password?error=missing_code', url.origin)
    )
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL('/forgot-password?error=invalid_or_expired_link', url.origin)
    )
  }

  return NextResponse.redirect(new URL(destination, url.origin))
}