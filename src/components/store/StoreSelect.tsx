'use client';

import React from 'react';
import { ChevronDown, MapPin, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios'; // Pastikan ini mengarah ke axiosInstance Anda

interface StoreOption {
    id: string;
    name: string;
    is_active: boolean;
}

interface StoreSelectProps {
    selectedStoreId: string;
    onChange: (storeId: string) => void;
}

export const StoreSelect = ({ selectedStoreId, onChange }: StoreSelectProps) => {

    const { data: stores, isLoading, isError } = useQuery({
        queryKey: ['stores-access'],
        queryFn: async () => {
            // Endpoint sesuai cURL Anda
            const res = await api.get('/stores/my-access');

            /**
             * PENYESUAIAN STRUKTUR:
             * res.data -> Merujuk ke body response (success, statusCode, message, data)
             * res.data.data -> Merujuk ke array store yang Anda berikan
             */
            return res.data.data as StoreOption[];
        },
        staleTime: 1000 * 60 * 10, // Cache 10 menit
    });

    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <MapPin size={10} className={isLoading ? "animate-pulse text-blue-400" : ""} />
                Lokasi Penyimpanan
            </label>

            <div className="relative group">
                <select
                    value={selectedStoreId}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white outline-none appearance-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
                >
                    {isLoading ? (
                        <option className="bg-slate-900 text-white">Menghubungkan ke Cabang...</option>
                    ) : (
                        <>
                            <option value="" disabled className="bg-slate-900 text-slate-500">
                                {isError ? 'Gagal memuat lokasi' : 'Pilih Cabang / Gudang...'}
                            </option>
                            {stores?.filter(s => s.is_active).map((store) => (
                                <option key={store.id} value={store.id} className="bg-slate-900 text-white py-2">
                                    {store.name}
                                </option>
                            ))}
                        </>
                    )}
                </select>

                {/* Indikator Status Kanan */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </div>
            </div>

            {isError && (
                <p className="text-[9px] text-red-400 font-bold ml-1 italic animate-bounce">
                    Terjadi kesalahan saat memuat data cabang.
                </p>
            )}
        </div>
    );
};