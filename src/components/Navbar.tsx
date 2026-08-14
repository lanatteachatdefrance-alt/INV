'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  CircleUserRound,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  User,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { createClient } from '@/utils/supabase/client'
import { PrimaryButton } from '@/components/ui/Buttons'
import { cn, formatFcfa } from '@/lib/utils'

const titles: Record<string, string> = {
  '/': 'Investir Bourse',
  '/dashboard': 'Accueil',
  '/dashboard/investments': 'Marche',
  '/dashboard/orders': 'Ordres',
  '/dashboard/kyc': 'Conformite',
  '/login': 'Connexion',
  '/register': 'Inscription',
  '/admin': 'Administration',
  '/admin/users': 'Clients',
  '/admin/offers': 'Offres',
  '/admin/requests': 'Demandes',
}

type Profile = {
  first_name: string | null
  last_name: string | null
  balance: number | string | null
  kyc_status: string | null
}

type ProfileMenuProps = {
  fullName: string
  email: string
  initials: string
  balance: number
  kycLabel: string
  isKycValid: boolean
  loading: boolean
  onLogout: () => void
}

export default function Navbar({
  userEmail,
}: {
  userEmail?: string
}) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const supabase = createClient()

  const [open, setOpen] = useState(false)
  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [loadingProfile, setLoadingProfile] =
    useState(false)

  const menuRef =
    useRef<HTMLDivElement>(null)

  const title =
    titles[pathname] ||
    (pathname.startsWith('/admin')
      ? 'Admin'
      : pathname.startsWith('/dashboard')
        ? 'Espace client'
        : 'Investir Bourse')

  const showBack =
    pathname.startsWith('/dashboard/') ||
    (pathname.startsWith('/admin/') &&
      pathname !== '/admin')

  // =====================================================
  // CHARGEMENT DU PROFIL
  // =====================================================

  useEffect(() => {
    if (!userEmail) {
      setProfile(null)
      return
    }

    let active = true

    const loadProfile = async () => {
      setLoadingProfile(true)

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user || !active) {
          return
        }

        const {
          data,
          error,
        } = await supabase
          .from('users')
          .select(
            'first_name, last_name, balance, kyc_status'
          )
          .eq('id', user.id)
          .single()

        if (error) {
          console.error(
            'Erreur chargement profil:',
            error.message
          )
          return
        }

        if (active) {
          setProfile(data)
        }
      } catch (error) {
        console.error(
          'Erreur chargement profil:',
          error
        )
      } finally {
        if (active) {
          setLoadingProfile(false)
        }
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [userEmail, supabase])

  // =====================================================
  // FERMETURE DU MENU EN CLIQUANT À L'EXTÉRIEUR
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener(
        'mousedown',
        handleClickOutside
      )
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [open])

  // =====================================================
  // DÉCONNEXION
  // =====================================================

  const logout = async () => {
    setOpen(false)

    try {
      const { error } =
        await supabase.auth.signOut({
          scope: 'local',
        })

      if (error) {
        console.error(
          'Erreur déconnexion Supabase:',
          error.message
        )

        return
      }

      // Vérifie que la session locale
      // a bien été supprimée.
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        console.error(
          'La session Supabase est toujours présente après la déconnexion.'
        )

        return
      }

      // Recharge complètement l'application.
      // Le middleware et le layout serveur
      // verront alors user = null.
      window.location.replace('/login')
    } catch (error) {
      console.error(
        'Erreur lors de la déconnexion:',
        error
      )
    }
  }

  // =====================================================
  // INFORMATIONS PROFIL
  // =====================================================

  const firstName =
    profile?.first_name?.trim() || ''

  const lastName =
    profile?.last_name?.trim() || ''

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    userEmail?.split('@')[0] ||
    'Utilisateur'

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .trim()
      .toUpperCase() ||
    fullName.charAt(0).toUpperCase()

  const balance =
    Number(profile?.balance ?? 0)

  const normalizedKyc =
    profile?.kyc_status
      ?.toLowerCase()
      .trim()

  const isKycValid =
    normalizedKyc === 'valid' ||
    normalizedKyc === 'approved' ||
    normalizedKyc === 'valide'

  const kycLabel = isKycValid
    ? 'KYC valide'
    : 'KYC en attente'

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl"
      style={{
        paddingTop:
          'env(safe-area-inset-top)',
      }}
    >
      {/* =====================================================
          MOBILE
      ===================================================== */}

      <div className="lg:hidden flex h-14 items-center justify-between gap-2 px-4">

        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Retour"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <Link
            href={
              userEmail
                ? '/dashboard'
                : '/'
            }
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-gradient text-xs font-black text-white shadow-glow"
          >
            IB
          </Link>
        )}

        <div className="min-w-0 flex-1 text-center">

          <p className="truncate text-sm font-bold text-slate-900">
            {title}
          </p>

          {userEmail && (
            <p className="truncate text-[10px] text-fin-mute">
              {fullName}
            </p>
          )}

        </div>

        {userEmail ? (
          <div
            className="relative"
            ref={menuRef}
          >

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (value) => !value
                )
              }
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs font-bold text-white shadow-sm',
                open &&
                  'ring-2 ring-blue-100'
              )}
              aria-label="Mon profil"
              aria-expanded={open}
            >
              {open ? (
                <X size={18} />
              ) : (
                initials
              )}
            </button>

            {open && (
              <ProfileMenu
                fullName={fullName}
                email={userEmail}
                initials={initials}
                balance={balance}
                kycLabel={kycLabel}
                isKycValid={isKycValid}
                loading={loadingProfile}
                onLogout={logout}
              />
            )}

          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setOpen(
                (value) => !value
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
            aria-label="Menu"
          >
            {open ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>
        )}

      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="hidden h-16 items-center justify-between px-6 lg:flex">

        <div>

          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="text-[11px] text-fin-mute">
            Marches regionaux - Temps reel
          </p>

        </div>

        <div className="flex items-center gap-3">

          {userEmail ? (
            <>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-900"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>

              <div
                className="relative"
                ref={menuRef}
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpen(
                      (value) => !value
                    )
                  }
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition',
                    'hover:border-blue-200 hover:bg-blue-50/30'
                  )}
                  aria-label="Mon profil"
                  aria-expanded={open}
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                    {initials}
                  </div>

                  <div className="max-w-[150px] text-left">

                    <p className="truncate text-xs font-bold text-slate-900">
                      {fullName}
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                      Mon profil
                    </p>

                  </div>

                  <ChevronDown
                    size={15}
                    className={cn(
                      'text-slate-400 transition-transform',
                      open &&
                        'rotate-180'
                    )}
                  />

                </button>

                {open && (
                  <ProfileMenu
                    fullName={fullName}
                    email={userEmail}
                    initials={initials}
                    balance={balance}
                    kycLabel={kycLabel}
                    isKycValid={isKycValid}
                    loading={loadingProfile}
                    onLogout={logout}
                  />
                )}

              </div>

            </>
          ) : (
            <>

              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Se connecter
              </Link>

              <Link href="/register">
                <PrimaryButton size="sm">
                  Creer un compte
                </PrimaryButton>
              </Link>

            </>
          )}

        </div>

      </div>

      {/* =====================================================
          MENU MOBILE NON CONNECTÉ
      ===================================================== */}

      {open && !userEmail && (
        <div className="space-y-2 border-t border-slate-200 bg-white p-4 lg:hidden">

          <Link
            href="/login"
            onClick={() =>
              setOpen(false)
            }
            className="block rounded-2xl bg-slate-100 p-4 text-center text-sm font-semibold text-slate-900"
          >
            Se connecter
          </Link>

          <Link
            href="/register"
            onClick={() =>
              setOpen(false)
            }
            className="block rounded-2xl bg-primary-gradient p-4 text-center text-sm font-semibold text-white"
          >
            Creer un compte
          </Link>

        </div>
      )}

    </header>
  )
}

// =========================================================
// MENU PROFIL
// =========================================================

function ProfileMenu({
  fullName,
  email,
  initials,
  balance,
  kycLabel,
  isKycValid,
  loading,
  onLogout,
}: ProfileMenuProps) {
  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[310px] max-w-[calc(100vw-24px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">

      {/* HEADER PROFIL */}

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-sm font-black">
            {initials}
          </div>

          <div className="min-w-0">

            <p className="truncate text-base font-bold">
              {fullName}
            </p>

            <p className="truncate text-xs text-white/60">
              {email}
            </p>

          </div>

        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">

          <User size={12} />

          <span className="text-[10px] font-semibold uppercase tracking-wider">
            Profil client
          </span>

        </div>

      </div>

      {/* INFORMATIONS */}

      <div className="space-y-2 p-4">

        {/* EMAIL */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Mail size={16} />
          </div>

          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Adresse e-mail
            </p>

            <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
              {email}
            </p>

          </div>

        </div>

        {/* SOLDE */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Wallet size={16} />
          </div>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Solde disponible
            </p>

            {loading ? (
              <div className="mt-1 h-4 w-24 animate-pulse rounded bg-slate-200" />
            ) : (
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {formatFcfa(balance)}
              </p>
            )}

          </div>

        </div>

        {/* KYC */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">

          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl',
              isKycValid
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-orange-50 text-orange-600'
            )}
          >
            <ShieldCheck size={16} />
          </div>

          <div>

            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Verification
            </p>

            <p
              className={cn(
                'mt-0.5 text-xs font-bold',
                isKycValid
                  ? 'text-emerald-600'
                  : 'text-orange-600'
              )}
            >
              {kycLabel}
            </p>

          </div>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="mx-4 mb-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">

        <div className="flex items-start gap-2">

          <CircleUserRound
            size={15}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <p className="text-[10px] leading-relaxed text-blue-700">
            Ces informations sont consultables uniquement.
            Pour toute modification, veuillez contacter le
            service client.
          </p>

        </div>

      </div>

      {/* =====================================================
          DÉCONNEXION
      ===================================================== */}

      <div className="border-t border-slate-100 p-3">

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700"
        >

          <LogOut size={16} />

          Deconnexion

        </button>

      </div>

    </div>
  )
}

// =========================================================
// BOUTON NOTIFICATION
// =========================================================

export function NotificationButton() {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-slate-900"
      aria-label="Notifications"
    >
      <Bell size={18} />
    </button>
  )
}

// =========================================================
// USER DROPDOWN
// =========================================================

export function UserDropdown({
  email,
}: {
  email: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2">

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-white">
        {email.charAt(0).toUpperCase()}
      </div>

      <span className="max-w-[160px] truncate text-xs font-semibold text-slate-700">
        {email}
      </span>

    </div>
  )
}