'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import FormRenderer from '@/components/dynamic-form/FormRenderer';
import { CREATE_STORE_META } from '@/constants/store-meta';
import { ChevronLeft } from 'lucide-react';

export default function CreateStorePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      // Endpoint sesuai curl: /api/stores
      const res = await api.post('/stores', payload);
      return res.data;
    },
    onSuccess: () => {
      // Refresh list store agar data baru muncul
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      alert('Toko berhasil ditambahkan!');
      router.push('/store');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Gagal menambahkan toko');
    },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Tombol Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <div className="p-2 rounded-lg group-hover:bg-white shadow-sm transition-all">
            <ChevronLeft size={20} />
          </div>
          <span className="font-medium">Kembali ke Daftar</span>
        </button>

        {/* Form Renderer */}
        <FormRenderer 
          meta={CREATE_STORE_META}
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitLabel="Simpan Cabang"
        />
        
        <p className="text-center text-slate-400 text-xs mt-8">
          Pastikan data yang dimasukkan sudah benar untuk keperluan cetak struk.
        </p>
      </div>
    </div>
  );
}