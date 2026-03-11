"use client";

import React, { useState, useEffect } from 'react';
import { createSupportTicket, SupportData } from '@/services/supportService';

export default function HelpCenterButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Sesuaikan mapping dengan --data-raw curl Anda
    const payload: SupportData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string,
      description: formData.get('description') as string,
    };

    try {
      await createSupportTicket(payload);
      alert("✅ Laporan terkirim! Tim Kalnaf akan segera mengecek kendala Anda.");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Gagal mengirim support:", error);
      alert(error.response?.data?.message || "❌ Gagal mengirim laporan. Cek koneksi server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Tombol Trigger (Sama seperti sebelumnya) */}
      <div className="fixed bottom-6 right-6 z-50 group flex items-center">
        <div className="mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <span className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-white/10">Ada kendala?</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-all">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Modal Form */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className="text-2xl font-bold">Pusat Bantuan</h3>
              <p className="text-blue-100 text-sm mt-1">SaaS Kalnaf Coresys Support System</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Nama Lengkap</label>
                <input name="name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-900" placeholder="Budi Kasir" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                  <input name="email" type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-900" placeholder="budi@kalnaf.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">WhatsApp</label>
                  <input name="whatsapp" type="tel" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-900" placeholder="0812..." />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Deskripsi Kendala</label>
                <textarea name="description" required rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-gray-900" placeholder="Printer tidak terdeteksi..."></textarea>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? 'Sedang Mengirim...' : 'Kirim Laporan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}