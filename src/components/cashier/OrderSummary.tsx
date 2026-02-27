'use client';

import React from 'react';
import { Loader2, Banknote } from 'lucide-react';

interface Props {
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  grandTotal: number;
  changeAmount: number;
  paymentMethod: string;
  isProcessing: boolean;
  onCheckout: () => void;
  canCheckout: boolean;
  setCashAmount?: (amount: number) => void;
}

export const OrderSummary = ({ 
  subtotal, discountAmount, discountPercent, taxAmount, grandTotal, 
  changeAmount, paymentMethod, isProcessing, onCheckout, canCheckout,
  setCashAmount 
}: Props) => {

  // Generate rekomendasi uang tunai
  const suggestions = React.useMemo(() => {
    if (grandTotal <= 0 || paymentMethod !== 'CASH') return [];
    const vals = new Set<number>();
    vals.add(grandTotal); // Uang Pas
    
    const nominals = [20000, 50000, 100000];
    nominals.forEach(n => {
      if (n > grandTotal) vals.add(n);
    });

    // Pembulatan ke atas terdekat ke 10rb
    const roundUp = Math.ceil(grandTotal / 10000) * 10000;
    if (roundUp > grandTotal) vals.add(roundUp);

    return Array.from(vals).sort((a, b) => a - b).slice(0, 4);
  }, [grandTotal, paymentMethod]);

  return (
    <div className="bg-white rounded-t-[2.5rem] pt-2">
      {/* Rekomendasi Bayar Chips - Minimalis */}
      {paymentMethod === 'CASH' && suggestions.length > 0 && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-1">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((amt) => (
              <button
                key={amt}
                onClick={() => setCashAmount?.(amt)}
                className="flex-1 py-2 px-1 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-600 hover:text-blue-600 transition-all active:scale-95"
              >
                {amt === grandTotal ? 'PAS' : amt.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rincian Biaya */}
      <div className="space-y-2 text-[10px] font-bold uppercase tracking-widest border-b border-dashed border-slate-100 pb-4 mb-4">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span className="text-slate-600">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-rose-500">
            <span>Diskon ({discountPercent}%)</span>
            <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-400">
          <span>Pajak (10%)</span>
          <span className="text-slate-600">+ Rp {taxAmount.toLocaleString('id-ID')}</span>
        </div>
      </div>
      
      {/* Total Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-slate-400 font-black text-[9px] uppercase italic block mb-1">Grand Total</span>
          <span className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">
            Rp {grandTotal.toLocaleString('id-ID')}
          </span>
        </div>
        {paymentMethod === 'CASH' && (
          <div className="text-right">
            <span className="text-slate-400 font-black text-[9px] uppercase block mb-1">Kembali</span>
            <span className={`text-lg font-black italic leading-none ${changeAmount >= 0 ? 'text-emerald-500' : 'text-slate-200'}`}>
              Rp {Math.max(0, changeAmount).toLocaleString('id-ID')}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onCheckout}
        disabled={!canCheckout || isProcessing}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-2xl font-black text-xl uppercase italic transition-all shadow-lg shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Bayar Sekarang'}
      </button>
    </div>
  );
};