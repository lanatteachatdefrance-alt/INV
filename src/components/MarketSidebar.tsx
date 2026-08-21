export default function MarketSidebar() {
  return (
    <aside className="w-64 hidden lg:flex flex-col gap-6 flex-shrink-0">

      {/* =====================================================
          TOP 5
      ===================================================== */}

      <div className="rounded-2xl border border-[var(--fin-border)] bg-white shadow-sm overflow-hidden">

        <div className="bg-[var(--fin-primary)] text-white font-bold p-3 text-xs flex justify-between uppercase tracking-wider">

          <span>TOP 5</span>

          <span className="text-[10px] font-normal">
            Cours
          </span>

          <span className="text-[10px] font-normal">
            Variation
          </span>

        </div>

        <div className="text-sm divide-y divide-[var(--fin-border)]">

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              SICC
            </span>

            <span className="text-[var(--fin-text)]">
              5 100
            </span>

            <span className="text-[var(--fin-success)] font-bold">
              7,38% ▲
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              BOAN
            </span>

            <span className="text-[var(--fin-text)]">
              5 350
            </span>

            <span className="text-[var(--fin-success)] font-bold">
              6,67% ▲
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              SPHC
            </span>

            <span className="text-[var(--fin-text)]">
              7 500
            </span>

            <span className="text-[var(--fin-success)] font-bold">
              4,66% ▲
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              SNTS
            </span>

            <span className="text-[var(--fin-text)]">
              32 450
            </span>

            <span className="text-[var(--fin-success)] font-bold">
              3,62% ▲
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              ECOC
            </span>

            <span className="text-[var(--fin-text)]">
              15 700
            </span>

            <span className="text-[var(--fin-success)] font-bold">
              3,44% ▲
            </span>
          </div>

        </div>
      </div>

      {/* =====================================================
          FLOP 5
      ===================================================== */}

      <div className="rounded-2xl border border-[var(--fin-border)] bg-white shadow-sm overflow-hidden">

        <div className="bg-[var(--fin-primary)] text-white font-bold p-3 text-xs flex justify-between uppercase tracking-wider">

          <span>FLOP 5</span>

          <span className="text-[10px] font-normal">
            Cours
          </span>

          <span className="text-[10px] font-normal">
            Variation
          </span>

        </div>

        <div className="text-sm divide-y divide-[var(--fin-border)]">

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              SAFC
            </span>

            <span className="text-[var(--fin-text)]">
              4 550
            </span>

            <span className="text-[var(--fin-danger)] font-bold">
              -7,42% ▼
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              ETIT
            </span>

            <span className="text-[var(--fin-text)]">
              63
            </span>

            <span className="text-[var(--fin-danger)] font-bold">
              -7,14% ▼
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              SEMC
            </span>

            <span className="text-[var(--fin-text)]">
              1 535
            </span>

            <span className="text-[var(--fin-danger)] font-bold">
              -7,14% ▼
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              STAC
            </span>

            <span className="text-[var(--fin-text)]">
              3 185
            </span>

            <span className="text-[var(--fin-danger)] font-bold">
              -6,61% ▼
            </span>
          </div>

          <div className="flex justify-between p-3">
            <span className="font-bold text-[var(--fin-accent-dark)]">
              VIVO
            </span>

            <span className="text-[var(--fin-text)]">
              1 800
            </span>

            <span className="text-[var(--fin-danger)] font-bold">
              -5,03% ▼
            </span>
          </div>

        </div>
      </div>

      {/* =====================================================
          ACTIVITÉS DU MARCHÉ
      ===================================================== */}

      <div className="rounded-2xl border border-[var(--fin-border)] bg-white shadow-sm overflow-hidden">

        <div className="bg-[var(--fin-primary)] text-white font-bold p-3 text-xs uppercase tracking-wider">
          Activités du marché
        </div>

        <div className="text-sm divide-y divide-[var(--fin-border)]">

          <div className="flex justify-between p-3">

            <span className="text-[var(--fin-mute)] text-xs">
              Valeurs transactions
            </span>

            <span className="font-bold text-xs text-[var(--fin-primary)]">
              2 919 883 FCFA
            </span>

          </div>

          <div className="flex justify-between p-3">

            <span className="text-[var(--fin-mute)] text-xs">
              Capitalisation Actions
            </span>

            <span className="font-bold text-xs text-[var(--fin-primary)]">
              15 384 908 FCFA
            </span>

          </div>

        </div>
      </div>

    </aside>
  )
}