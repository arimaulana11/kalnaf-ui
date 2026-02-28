"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  WifiOff, 
  CloudUpload, 
  Bell, 
  Search, 
  X, 
  Package, 
  History, 
  Zap, 
  ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  isOnline: boolean;
  onMenuClick: () => void;
}

export const Header = ({ isOnline, onMenuClick }: HeaderProps) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Shortcut keyboard CMD+K atau CTRL+K untuk pencarian
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-[40]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick} 
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all active:scale-90"
          >
            <Menu size={20} />
          </button>

          {/* Status Koneksi */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
            isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {isOnline ? (
              <>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Cloud Sync Active</span>
                <CloudUpload size={14} className="opacity-70" />
              </>
            ) : (
              <>
                <WifiOff size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Offline Mode</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4 border-r border-slate-200 pr-4 md:pr-6">
            {/* Search Trigger */}
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative group"
            >
              <Search size={20} />
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                Cari (Ctrl+K)
              </span>
            </button>

            {/* Notification Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className={`p-2 transition-all rounded-lg relative ${showNotif ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* DUMMY NOTIFICATION DROPDOWN */}
              {showNotif && (
                <div className="absolute top-12 right-0 w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="px-4 pb-3 border-b border-slate-50 flex justify-between items-center">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-900">Notifikasi</h4>
                    <span className="bg-blue-100 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">2 Baru</span>
                  </div>
                  
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                    {/* Item 1: Stock Alert */}
                    <div className="p-4 hover:bg-slate-50 flex gap-3 transition-colors cursor-pointer border-b border-slate-50/50 group">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                        <Package size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Stok Hampir Habis</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Kopi Kapal Api sisa 3 pcs. Segera buat pesanan ke supplier.</p>
                        <p className="text-[9px] text-slate-400 mt-2 font-medium">5 menit yang lalu</p>
                      </div>
                    </div>

                    {/* Item 2: Subscription Alert */}
                    <div className="p-4 hover:bg-slate-50 flex gap-3 transition-colors cursor-pointer border-b border-slate-50/50 group">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Trial Berakhir</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Masa percobaan Anda tersisa 4 hari lagi. Upgrade sekarang!</p>
                        <p className="text-[9px] text-slate-400 mt-2 font-medium">1 jam yang lalu</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 pt-3">
                    <button className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest bg-slate-50 rounded-xl">
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none uppercase tracking-tighter">Owner Toko</p>
              <p className="text-[9px] text-blue-600 font-bold uppercase mt-1 px-2 py-0.5 bg-blue-50 rounded-md tracking-widest inline-block">Cabang Pusat</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-white shadow-lg rounded-2xl flex items-center justify-center text-blue-400 font-black italic hover:rotate-3 transition-transform cursor-pointer group">
              <span className="group-hover:scale-110 transition-transform">OT</span>
            </div>
          </div>
        </div>
      </header>

      {/* DUMMY SEARCH MODAL (COMMAND PALETTE) */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSearch(false)} />
          
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 slide-in-from-top-4 duration-300 relative z-[101]">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="text-slate-400" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Cari produk, transaksi, atau menu..." 
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {/* Recent Section */}
              <div className="p-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2">Pencarian Terakhir</p>
                
                <div className="space-y-1">
                  {[
                    { icon: <Package size={16} />, label: 'Kopi Kapal Api 165gr', sub: 'Produk • Stok: 12' },
                    { icon: <History size={16} />, label: '#TRX-99201', sub: 'Transaksi • Rp 152.000' },
                    { icon: <Zap size={16} />, label: 'Upgrade Plan', sub: 'Menu • Billing' },
                  ].map((res, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-2xl transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          {res.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{res.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{res.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-100">
              <div className="flex gap-4">
                <span className="text-[9px] font-bold text-slate-400"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm mr-1">Enter</kbd> Pilih</span>
                <span className="text-[9px] font-bold text-slate-400"><kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm mr-1">Esc</kbd> Tutup</span>
              </div>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest italic italic">Kalnaf Search v1.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};