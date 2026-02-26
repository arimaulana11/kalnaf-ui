#!/bin/bash

# Konfigurasi Path (Sesuaikan dengan folder project kamu)
TARGET_DIR="./src/components/cashier"
FILE_NAME="TransactionHistory.tsx"

# Membuat direktori jika belum ada
mkdir -p $TARGET_DIR

echo "Creating Transaction History Component in $TARGET_DIR..."

cat <<EOF > "$TARGET_DIR/$FILE_NAME"
'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Printer, RotateCcw, 
  ChevronRight, Calendar, Download, Eye,
  ArrowLeft, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

export const TransactionHistory = () => {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Mock Data untuk Visualisasi
  const transactions = [
    { id: 'TRX-2026-001', customer: 'Budi Santoso', total: 155000, status: 'PAID', time: '10:30', date: '26 Feb 2026', items: 3 },
    { id: 'TRX-2026-002', customer: 'Pelanggan Umum', total: 45000, status: 'DEBT', time: '11:15', date: '26 Feb 2026', items: 1 },
    { id: 'TRX-2026-003', customer: 'Siti Aminah', total: 210000, status: 'PAID', time: '12:00', date: '26 Feb 2026', items: 5 },
    { id: 'TRX-2026-004', customer: 'Andi Wijaya', total: 85000, status: 'VOID', time: '12:45', date: '26 Feb 2026', items: 2 },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'DEBT': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'VOID': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] p-4 gap-4 font-sans text-slate-900">
      
      {/* --- LIST TRANSAKSI --- */}
      <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-black tracking-tight uppercase">History <span className="text-blue-600">Transactions</span></h1>
            <div className="flex gap-2">
               <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-200 hover:bg-white transition-all"><Download size={18} /></button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="text" placeholder="Search transaction ID or customer..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
              <Calendar size={18} />
              <span className="text-xs font-bold uppercase">Today</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4 font-center">Customer</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="hover:bg-blue-50/30 transition-all cursor-pointer group">
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-800">{tx.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tx.time} • {tx.items} Items</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-600">{tx.customer}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tight">Rp {tx.total.toLocaleString('id-ID')}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={\`px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border \${getStatusStyle(tx.status)}\`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300 group-hover:text-blue-500 transition-colors">
                    <ChevronRight size={20} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DETAIL PANEL --- */}
      <div className="w-[420px] bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden relative transition-all">
        {selectedTx ? (
          <>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-6">
                <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400">
                   <ArrowLeft size={20} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all active:scale-95">
                  <Printer size={14} /> Print Receipt
                </button>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedTx.id}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cashier: Admin User</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               <div className="flex items-center gap-2 mb-6">
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Order List</span>
                 <div className="h-[1px] flex-1 bg-slate-100"></div>
               </div>
               
               <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex justify-between gap-4">
                     <div className="flex-1">
                        <p className="text-xs font-black text-slate-800 uppercase leading-tight">Caramel Macchiato Large</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Quantity: 1x</p>
                     </div>
                     <p className="text-xs font-black text-slate-900 tracking-tight">Rp 35.000</p>
                   </div>
                 ))}
               </div>

               <div className="mt-8 pt-6 border-t border-dashed border-slate-200 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Subtotal</span>
                    <span>Rp 105.000</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Tax (11%)</span>
                    <span>Rp 11.550</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-2">
                    <span className="uppercase tracking-tighter text-sm">Grand Total</span>
                    <span className="text-blue-600">Rp 116.550</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
               <button className="w-full py-4 bg-white border-2 border-rose-100 hover:border-rose-500 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-sm group">
                  <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Void Transaction
               </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner text-slate-300">
              <AlertCircle size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">No Selection</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Please select a transaction from the list to see detailed information</p>
          </div>
        )}
      </div>
    </div>
  );
};
EOF

echo "Done! File created: $TARGET_DIR/$FILE_NAME"