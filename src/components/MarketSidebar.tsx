export default function MarketSidebar() {
  return (
    <aside className="w-64 hidden lg:flex flex-col gap-6 flex-shrink-0">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white font-bold p-3 text-xs flex justify-between uppercase tracking-wider">
          <span>TOP 5</span>
          <span className="text-[10px] font-normal">Cours</span>
          <span className="text-[10px] font-normal">Variation</span>
        </div>
        <div className="text-sm divide-y divide-slate-100">
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SICC</span><span>7 000</span><span className="text-emerald-600 font-bold">7,38% ▲</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">BOAN</span><span>4 790</span><span className="text-emerald-600 font-bold">6,67% ▲</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SPHC</span><span>7 550</span><span className="text-emerald-600 font-bold">4,66% ▲</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SNTS</span><span>16 000</span><span className="text-emerald-600 font-bold">3,62% ▲</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">ECOC</span><span>7 000</span><span className="text-emerald-600 font-bold">3,44% ▲</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white font-bold p-3 text-xs flex justify-between uppercase tracking-wider">
          <span>FLOP 5</span>
          <span className="text-[10px] font-normal">Cours</span>
          <span className="text-[10px] font-normal">Variation</span>
        </div>
        <div className="text-sm divide-y divide-slate-100">
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SAFC</span><span>4 200</span><span className="text-rose-600 font-bold">-7,42% ▼</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">ETIT</span><span>64</span><span className="text-rose-600 font-bold">-7,14% ▼</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SEMC</span><span>1 500</span><span className="text-rose-600 font-bold">-7,14% ▼</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">STAC</span><span>4 000</span><span className="text-rose-600 font-bold">-6,61% ▼</span></div>
          <div className="flex justify-between p-3"><span className="font-bold text-slate-900">SHEC</span><span>1 210</span><span className="text-rose-600 font-bold">-5,03% ▼</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white font-bold p-3 text-xs uppercase tracking-wider">Activités du marché</div>
        <div className="text-sm divide-y divide-slate-100">
          <div className="flex justify-between p-3"><span className="text-slate-500 text-xs">Valeurs transactions</span><span className="font-bold text-xs text-slate-900">2 919 883 FCFA</span></div>
          <div className="flex justify-between p-3"><span className="text-slate-500 text-xs">Capitalisation Actions</span><span className="font-bold text-xs text-slate-900">15 384 908 FCFA</span></div>
        </div>
      </div>
    </aside>
  )
}
