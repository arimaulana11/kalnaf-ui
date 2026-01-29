'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { ShiftWrapper } from '@/components/shift/ShiftWrapper';
import { AssignStaffModal } from '@/components/shift/AssignStaffModal'; // Pastikan path import benar
import {
  Loader2,
  Store,
  ChevronDown,
  AlertCircle,
  Clock,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Interface untuk tipe data Store berdasarkan response API
 */
interface StoreData {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
}

export default function ActiveShiftPage() {
  const queryClient = useQueryClient();
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Daftar Toko (Menggunakan endpoint /api/stores)
  const { data: stores, isLoading: isLoadingStores } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const res = await api.get('/stores/my-access');
      return res.data.data as StoreData[] || [];
    }
  });

  // 2. Fetch Status Shift Aktif untuk Toko yang dipilih
  const {
    data: currentShift,
    isLoading: isLoadingShift,
    isError: isShiftError
  } = useQuery({
    queryKey: ['current-shift', selectedStoreId],
    queryFn: async () => {
      try {
        const res = await api.get(`/stores/shift/current?storeId=${selectedStoreId}`);
        return res.data.data;
      } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!selectedStoreId,
    retry: false,
  });

  // 3. Mutation: Buka Shift (Open)
  const openShift = useMutation({
    mutationFn: async (startingCash: number) => {
      return api.post('/stores/shift/open', {
        storeId: selectedStoreId,
        startingCash
      });
    },
    onSuccess: () => {
      toast.success('Shift berhasil dibuka. Selamat bertugas!');
      queryClient.invalidateQueries({ queryKey: ['current-shift', selectedStoreId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal membuka shift');
    }
  });

  // 4. Mutation: Tutup Shift (Close)
  const closeShift = useMutation({
    mutationFn: async (payload: { actualCash: number; note: string }) => {
      if (!currentShift?.id) throw new Error("ID Shift aktif tidak ditemukan");

      return api.post('/stores/shift/close', {
        shiftId: currentShift.id,
        actualCash: payload.actualCash,
        note: payload.note
      });
    },
    onSuccess: () => {
      toast.success('Shift ditutup. Laporan berhasil disimpan.');
      queryClient.invalidateQueries({ queryKey: ['current-shift', selectedStoreId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menutup shift');
    }
  });

  // 5. Mutation: Assign Staff (BARU)
  const assignStaff = useMutation({
    mutationFn: async (staffId: string) => {
      return api.post(`/stores/${selectedStoreId}/assign-staff`, {
        user_id: staffId
      });
    },
    onSuccess: () => {
      toast.success('Staff berhasil ditugaskan ke cabang ini!');
      setIsModalOpen(false); // Tutup modal setelah sukses
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Gagal menugaskan staff');
    }
  });

  /**
   * Logika Konten (SonarQube S3358 Safe)
   */
  let content;

  if (!selectedStoreId) {
    content = (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-16 rounded-[3rem] text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
          <Store className="text-slate-300" size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Pilih Cabang Operasional</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 font-medium">
          Silahkan tentukan lokasi cabang Anda untuk mengelola pembukaan dan penutupan kasir.
        </p>
      </div>
    );
  } else if (isLoadingShift) {
    content = (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-400 font-bold animate-pulse text-sm tracking-widest uppercase">Sinkronisasi Data...</p>
      </div>
    );
  } else if (isShiftError) {
    content = (
      <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-bold text-red-900 uppercase">Koneksi Terputus</h3>
        <p className="text-red-600/70 text-sm mt-1 max-w-sm mx-auto">
          Gagal mengambil status shift dari server. Pastikan layanan backend Anda aktif.
        </p>
      </div>
    );
  } else {
    content = (
      <ShiftWrapper
        isActive={!!currentShift}
        onOpenShift={(cash: number) => openShift.mutate(cash)}
        onCloseShift={(actualCash: number, note: string) => closeShift.mutate({ actualCash, note })}
        data={currentShift}
        isLoadingAction={openShift.isPending || closeShift.isPending}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 min-h-screen font-sans selection:bg-blue-100">

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em]">
            <Clock size={14} />
            <span>Manajemen Real-time</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Operasional Shift
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Tombol Assign Staff - Muncul hanya jika Toko sudah dipilih */}
          {selectedStoreId && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-white border-2 border-slate-100 px-5 py-3 rounded-2xl font-bold text-sm text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
            >
              <UserPlus size={18} />
              Assign Staff
            </button>
          )}

          {selectedStoreId && !isLoadingShift && currentShift && (
            <div className="flex items-center gap-3 px-5 py-2.5 bg-green-50 border border-green-100 rounded-2xl text-green-700 shadow-sm animate-in slide-in-from-right-5">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider">Kasir Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION SELECTOR */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-200/60">
        <div className="relative max-w-md">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 block ml-1">
            Lokasi Cabang Saat Ini
          </label>
          <div className="relative group">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              disabled={isLoadingStores}
              className="w-full appearance-none bg-slate-50 border-2 border-transparent p-5 pr-14 rounded-[1.25rem] font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none disabled:opacity-50 cursor-pointer"
            >
              <option value="">{isLoadingStores ? 'Mencari Toko...' : '--- Pilih Cabang Toko ---'}</option>
              {stores?.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <ChevronDown size={22} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 border-dashed" />

      {/* SECTION MAIN CONTENT */}
      <div className="relative">
        {content}
      </div>

      {/* SECTION FOOTER GUIDANCE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <div className="group p-6 bg-white rounded-[2rem] border border-slate-100 flex gap-5 transition-all hover:border-blue-200">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl h-fit group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Keamanan Berlapis</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Setiap pembukaan kasir dicatat dengan stempel waktu dan ID user unik untuk audit sistem.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL ASSIGN STAFF */}
      {selectedStoreId && (
        <AssignStaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAssign={(userId) => assignStaff.mutate(userId)}
          isLoading={assignStaff.isPending}
        />
      )}

    </div>
  );
}