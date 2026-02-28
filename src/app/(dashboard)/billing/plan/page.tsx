"use client"; // <--- TAMBAHKAN INI

import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      price: isAnnual ? '99k' : '125k',
      description: 'Cocok untuk toko baru yang ingin go-digital.',
      features: ['Hingga 100 Produk', '1 Akun Kasir', 'Laporan Penjualan Dasar', 'Support via Email'],
      isPopular: false,
    },
    {
      name: 'Pro Business',
      price: isAnnual ? '199k' : '250k',
      description: 'Solusi lengkap untuk bisnis yang sedang berkembang.',
      features: ['Produk Tak Terbatas', '5 Akun Staff', 'Manajemen Stok & Opname', 'Laporan Laba Rugi', 'Support Prioritas 24/7'],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Skalabilitas penuh untuk manajemen multi-cabang.',
      features: ['Semua Fitur Pro', 'Multi-Outlet Management', 'Audit Log Keamanan', 'Custom Domain', 'Dedicated Manager'],
      isPopular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Pilih Paket Bisnis Anda</h1>
        <p className="text-slate-500 font-medium">Investasi terbaik untuk operasional toko yang lebih efisien dan terukur.</p>
        
        {/* TOGGLE TAHUNAN */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Bulanan</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-slate-200 rounded-full relative p-1 transition-all"
          >
            <div className={`w-5 h-5 bg-blue-600 rounded-full shadow-md transition-all ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
            Tahunan <span className="ml-1 text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">Hemat 20%</span>
          </span>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative bg-white rounded-[2.5rem] p-8 shadow-sm border ${plan.isPopular ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100'} transition-all hover:shadow-xl`}>
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star size={12} fill="currentColor" /> Paling Populer
              </div>
            )}

            <div className="mb-8 text-center">
              <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">{plan.description}</p>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center">
                <span className="text-sm font-bold text-slate-400 mr-1">Rp</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-400 font-bold ml-1">/bln</span>}
              </div>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-left">
                  <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${plan.isPopular ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-slate-600 leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 ${
              plan.isPopular 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}>
              {plan.name === 'Enterprise' ? 'Hubungi Kami' : 'Pilih Paket Ini'}
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER INFO */}
      <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="flex items-center gap-2 font-black text-slate-400 italic text-xs">MIDTRANS SECURED</div>
        <div className="flex items-center gap-2 font-black text-slate-400 italic text-xs">CLOUD BACKUP</div>
        <div className="flex items-center gap-2 font-black text-slate-400 italic text-xs">24/7 SUPPORT</div>
      </div>
    </div>
  );
}