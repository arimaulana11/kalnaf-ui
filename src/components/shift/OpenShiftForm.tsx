import React, { useState } from 'react';
import { Wallet, ArrowRight, Loader2 } from 'lucide-react';

export const OpenShiftForm = ({ onOpen, isLoading }: { onOpen: (cash: number) => void, isLoading?: boolean }) => {
  const [cash, setCash] = useState<string>('');

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Wallet size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">Buka Shift Baru</h2>
          <p className="text-slate-500 text-sm font-medium">Input saldo awal laci kasir (Modal).</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">
            Saldo Awal (IDR)
          </label>
          <input
            type="number"
            value={cash}
            onChange={(e) => setCash(e.target.value)}
            placeholder="Masukkan nominal, misal: 500000"
            className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-2xl font-black text-slate-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <button
          onClick={() => onOpen(Number(cash))}
          disabled={isLoading || !cash}
          className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white p-5 rounded-[1.25rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : (
            <>
              Buka Kasir Sekarang
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};