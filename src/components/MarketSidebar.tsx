export default function MarketSidebar() {
  return (
    <aside className="w-full lg:w-64 flex flex-col gap-6 self-start lg:self-stretch">
      <div className="lg:hidden px-2">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-brand-dark mb-2">Aperçu marché</div>
      </div>
      <div className="border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
           <div className="bg-brand-dark text-white font-bold p-3 text-sm flex justify-between items-center gap-2">
             <span className="min-w-[80px]">TOP 5</span>
             <span className="text-[10px] font-normal">Cours</span>
             <span className="text-[10px] font-normal">Variation</span>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">SICC</span><span className="font-black text-brand-dark">4 610</span><span className="text-green-600 font-bold">+7,38%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">BOAN</span><span className="font-black text-brand-dark">3 700</span><span className="text-green-600 font-bold">+6,67%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">SPHC</span><span className="font-black text-brand-dark">6 895</span><span className="text-green-600 font-bold">+4,66%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">SNTS</span><span className="font-black text-brand-dark">28 700</span><span className="text-green-600 font-bold">+3,62%</span></div>
             <div className="flex justify-between items-center p-2.5"><span className="font-bold text-gray-800">ECOC</span><span className="font-black text-brand-dark">16 000</span><span className="text-green-600 font-bold">+3,44%</span></div>
           </div>
        </div>

        <div className="border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
           <div className="bg-brand-dark text-white font-bold p-3 text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
             <span className="min-w-[80px]">FLOP 5</span>
             <div className="flex items-center gap-4">
               <span className="text-[10px] font-normal">Cours</span>
               <span className="text-[10px] font-normal">Variation</span>
             </div>
           </div>
           <div className="bg-white text-sm">
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">SAFC</span><span className="font-black text-brand-dark">3 710</span><span className="text-red-600 font-bold">-7,42%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">ETIT</span><span className="font-black text-brand-dark">30</span><span className="text-red-600 font-bold">-7,14%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">SEMC</span><span className="font-black text-brand-dark">1 495</span><span className="text-red-600 font-bold">-7,14%</span></div>
             <div className="flex justify-between items-center p-2.5 border-b"><span className="font-bold text-gray-800">STAC</span><span className="font-black text-brand-dark">2 840</span><span className="text-red-600 font-bold">-6,61%</span></div>
             <div className="flex justify-between items-center p-2.5"><span className="font-bold text-gray-800">SHEC</span><span className="font-black text-brand-dark">1 940</span><span className="text-red-600 font-bold">-5,03%</span></div>
           </div>
        </div>

        <div className="border border-gray-200 shadow-sm">
           <div className="bg-brand-dark text-white font-bold p-2 text-sm uppercase">Activités du marché</div>
           <div className="bg-white text-sm">
             <div className="flex justify-between p-2 border-b"><span className="text-gray-600 text-xs">Valeurs transactions</span><span className="font-bold text-xs">2 919 883 FCFA</span></div>
             <div className="flex justify-between p-2 border-b"><span className="text-gray-600 text-xs">Capitalisation Actions</span><span className="font-bold text-xs">15 384 908 FCFA</span></div>
           </div>
        </div>
    </aside>
  );
}
