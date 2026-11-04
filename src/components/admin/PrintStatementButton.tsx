'use client'

export default function PrintStatementButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-[#14283b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#203d59]"
    >
      Télécharger le relevé PDF
    </button>
  )
}