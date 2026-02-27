"use client";

import React from 'react';
import { History, Search, Save, ArrowRightLeft, Loader2, Calculator, PackageSearch, Info, Store, XCircle } from 'lucide-react';
import { useStockOpname } from '@/hooks/useStockOpname';

export default function StockOpnamePage() {
  const {
    isAuditActive, setIsAuditActive, isSubmitting, isLoadingData,
    searchQuery, setSearchQuery, items, inputExpressions,
    debouncedSearch, handlePhysicalChange, handleFinalize, router,
    selectedStoreId, setSelectedStoreId, stores 
  } = useStockOpname();

  // Fungsi untuk membatalkan audit
  const handleCancelAudit = () => {
    if (confirm("Apakah Anda yakin ingin membatalkan audit? Semua perubahan input yang belum disinkronkan akan hilang.")) {
      setIsAuditActive(false);
      setSearchQuery("");
      // Anda mungkin perlu menambahkan fungsi resetItems di hook jika ingin membersihkan list
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-black">
      {/* 1. TOP NAVIGATION */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/inventory/stock-opname/history')}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <History size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">View History</span>
        </button>

        {isAuditActive && (
          <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <span className="text-[10px] font-black uppercase italic">Audit Session Active</span>
          </div>
        )}
      </div>

      {/* 2. MAIN HEADER & STORE SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic uppercase leading-none tracking-tighter">
            Stock <span className="text-orange-500">Opname</span>
          </h1>
          
          <div className="mt-4 flex flex-col gap-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / Store</label>
            <div className="relative min-w-[320px]">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select 
                disabled={isAuditActive}
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className={`w-full pl-12 pr-10 py-3 bg-white border-2 rounded-xl font-bold appearance-none outline-none transition-all ${
                  isAuditActive ? 'border-transparent text-gray-300 opacity-70 bg-gray-100' : 'border-gray-100 focus:border-orange-500 shadow-sm'
                }`}
              >
                <option value="">Choose Store...</option>
                {stores.map((store: any) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!isAuditActive ? (
            <button
              disabled={!selectedStoreId}
              onClick={() => setIsAuditActive(true)}
              className={`px-10 py-4 rounded-2xl font-black uppercase italic transition-all active:scale-95 ${
                selectedStoreId 
                ? 'bg-black text-white shadow-xl hover:bg-gray-800 hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start New Audit
            </button>
          ) : (
            <>
              {/* TOMBOL BATAL / CANCEL */}
              <button
                onClick={handleCancelAudit}
                className="px-6 py-4 rounded-2xl font-black uppercase italic border-2 border-gray-200 text-gray-400 hover:bg-white hover:text-red-500 hover:border-red-500 transition-all flex items-center gap-2"
              >
                <XCircle size={20} />
                Cancel
              </button>

              {/* TOMBOL FINISH */}
              <button
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase italic flex items-center gap-3 shadow-xl hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Finish & Sync ({items.filter((i: any) => i.physicalStock !== i.systemStock).length})
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. SEARCH BAR */}
      <div className={`transition-all duration-500 ${isAuditActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-2 focus-within:shadow-xl focus-within:border-orange-200 transition-all">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
            <input
              type="text"
              placeholder={`Search products in ${stores.find(s => s.id === selectedStoreId)?.name || 'store'}...`}
              className="w-full pl-16 pr-4 py-5 bg-transparent border-none rounded-2xl outline-none font-bold text-gray-700 placeholder:text-gray-300 placeholder:italic"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); debouncedSearch(e.target.value) }}
            />
          </div>
          {isLoadingData && <Loader2 className="animate-spin text-orange-500 mr-6" />}
        </div>
      </div>

      {/* 4. CONTENT TABLE */}
      <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 min-h-[400px] mb-20 transition-all">
        {!isAuditActive ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-300 text-center px-10 animate-in fade-in zoom-in duration-300">
            <div className="p-8 bg-gray-50 rounded-full mb-6">
               <PackageSearch size={60} strokeWidth={1.5} className="opacity-20 text-black" />
            </div>
            <h3 className="text-black font-black uppercase italic tracking-widest mb-2">Audit Session Locked</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter leading-relaxed max-w-[250px]">
              {selectedStoreId 
                ? "Store is set. Ready to verify physical inventory." 
                : "Please select a branch location to begin."}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left border-collapse">
                {/* ... (The rest of your table code remains the same) ... */}
                <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Detail</th>
                  <th className="p-8 text-[10px] font-black uppercase text-gray-400 text-center tracking-widest">System vs Physical</th>
                  <th className="p-8 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length > 0 ? items.map((item: any) => {
                  const diff = (item.physicalStock || 0) - (item.systemStock || 0);
                  const hasChanged = item.physicalStock !== item.systemStock;
                  const multiplier = Number(item.multiplier) || 1;

                  return (
                    <tr key={item.id} className="group transition-all text-black hover:bg-gray-50/30">
                      <td className="p-8">
                        <div className="font-bold text-gray-800 uppercase text-sm group-hover:text-orange-600 transition-colors">{item.name}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[9px] font-black text-blue-500 italic bg-blue-50 px-2 py-1 rounded-md">{item.sku}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">Unit: {item.unitName}</span>
                          {!item.isBase && (
                             <span className="text-[9px] text-gray-500 font-black bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1 uppercase">
                               <Info size={10} /> 1 {item.unitName} = {multiplier.toLocaleString()} {item.baseUnitName}
                             </span>
                          )}
                        </div>
                      </td>

                      <td className="p-8">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-5">
                            <div className="flex flex-col items-end">
                              <span className="text-[8px] text-gray-300 font-black uppercase">System</span>
                              <span className="text-sm font-mono font-bold text-gray-400">{item.systemStock?.toLocaleString()}</span>
                            </div>
                            <ArrowRightLeft size={16} className="text-gray-200" />
                            <div className="relative">
                              <input
                                type="text"
                                className={`w-36 p-4 rounded-2xl text-center font-black outline-none border-2 transition-all ${
                                  hasChanged ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-transparent bg-gray-100 text-gray-600'
                                } focus:border-black focus:bg-white`}
                                value={inputExpressions[item.id] ?? item.physicalStock}
                                onChange={(e) => handlePhysicalChange(item.id, e.target.value)}
                              />
                              <Calculator size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-8 text-right">
                        <div className={`inline-block px-4 py-2 rounded-xl font-black italic text-sm ${
                          diff === 0 ? 'bg-gray-50 text-gray-300' : 
                          diff > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={3} className="p-20 text-center italic text-gray-400 font-bold">
                      No products found. Start typing to search...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}