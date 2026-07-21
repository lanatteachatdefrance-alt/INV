'use client'

import { useState, useRef, useEffect } from 'react'
import { UploadCloud, FileText, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { GlassCard } from '@/components/ui/GlassCard'
import { PrimaryButton } from '@/components/ui/Buttons'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function KYCPage() {
  const [idFile, setIdFile] = useState<File | null>(null)
  const [residenceFile, setResidenceFile] = useState<File | null>(null)
  const [idNumber, setIdNumber] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [kycStatus, setKycStatus] = useState<string | null>(null)
  const idInputRef = useRef<HTMLInputElement>(null)
  const residenceInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('users').select('kyc_status, id_number').eq('id', user.id).single()
        if (data) {
          setKycStatus(data.kyc_status)
          if (data.id_number) setIdNumber(data.id_number)
        }
      }
    }
    checkStatus()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idFile || !residenceFile || !idNumber) return
    setUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ kyc_status: 'en_attente', id_number: idNumber }).eq('id', user.id)
    }
    setUploading(false)
    setSuccess(true)
    setTimeout(() => {
      router.push('/dashboard')
      router.refresh()
    }, 1600)
  }

  return (
    <div className="fin-page max-w-3xl mx-auto">
      <GlassCard hover={false} className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Conformité KYC</h1>
            <p className="text-sm text-fin-mute mt-1">Sécurisez votre compte pour accéder au marché.</p>
          </div>
          <StatusBadge status={kycStatus === 'validé' ? 'success' : 'warning'}>
            {kycStatus === 'validé' ? 'Validé' : 'En attente'}
          </StatusBadge>
        </div>

        {kycStatus === 'validé' ? (
          <div className="py-12 text-center rounded-2xl border border-fin-success/20 bg-fin-success/5">
            <CheckCircle className="mx-auto text-fin-success mb-4" size={40} />
            <h3 className="text-xl font-bold">Identité validée</h3>
            <p className="text-sm text-fin-mute mt-2 max-w-md mx-auto">Votre compte est pleinement vérifié.</p>
          </div>
        ) : success ? (
          <div className="py-12 text-center rounded-2xl border border-fin-primary/20 bg-fin-primary/5">
            <CheckCircle className="mx-auto text-fin-primary mb-4" size={40} />
            <h3 className="text-xl font-bold">Dossier transmis</h3>
            <p className="text-sm text-fin-mute mt-2">Examen sous 24h ouvrées.</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-fin-mute block mb-1.5">Type de document</label>
                <select className="fin-input bg-fin-surface">
                  <option value="cni">CNI</option>
                  <option value="passport">Passeport</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-fin-mute block mb-1.5">Numéro</label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="C0123456789"
                  className="fin-input"
                />
              </div>
            </div>

            {[
              { label: 'Pièce d’identité', file: idFile, ref: idInputRef, set: setIdFile },
              { label: 'Justificatif de domicile', file: residenceFile, ref: residenceInputRef, set: setResidenceFile },
            ].map((block) => (
              <div key={block.label}>
                <label className="text-xs font-semibold text-fin-mute block mb-1.5">{block.label}</label>
                <button
                  type="button"
                  onClick={() => block.ref.current?.click()}
                  className={`w-full border border-dashed rounded-2xl p-6 text-center transition-all ${
                    block.file ? 'border-fin-primary/40 bg-fin-primary/5' : 'border-white/10 bg-fin-surface hover:bg-fin-hover'
                  }`}
                >
                  {block.file ? (
                    <>
                      <FileText className="mx-auto text-fin-primary mb-2" size={24} />
                      <p className="text-sm font-semibold">{block.file.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="mx-auto text-fin-mute mb-2" size={28} />
                      <p className="text-sm font-semibold text-fin-mute">Importer un fichier</p>
                    </>
                  )}
                  <input
                    ref={block.ref}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) block.set(e.target.files[0])
                    }}
                  />
                </button>
              </div>
            ))}

            <PrimaryButton
              type="submit"
              fullWidth
              size="lg"
              disabled={!idFile || !residenceFile || !idNumber || uploading}
            >
              {uploading ? 'Envoi en cours…' : 'Soumettre mon dossier'}
            </PrimaryButton>
          </form>
        )}
      </GlassCard>
    </div>
  )
}
