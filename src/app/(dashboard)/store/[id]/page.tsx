'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import FormRenderer from '@/components/dynamic-form/FormRenderer';
import { STORE_FORM_META } from '@/constants/store-meta';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Store, UpdateStorePayload } from '@/types/store';

export default function StoreDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  
  // 1. Fetch data detail toko
  const { data: storeData, isLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      const res = await api.get(`/stores/${id}`);
      return res.data.data;
    },
  });
  
  // 2. Mutasi untuk Update (PATCH/PUT)
  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateStorePayload) => {      
      const res = await api.patch(`/stores/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', id] }); // ✅ ADD THIS
      alert('Informasi toko berhasil diperbarui!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Gagal memperbarui toko');
    },
  });

  const handleSubmit = (storeData : Store) => {
    if (!storeData) return;

    const payload: UpdateStorePayload = {
      name: storeData.name,
      address: storeData.address,
      phone: storeData.phone,
      receipt_header: storeData.receipt_header,
      receipt_footer: storeData.receipt_footer,
      logo_url: storeData.logo_url,
      is_active:storeData.is_active,
    };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="bg-white rounded-[2.5rem] p-2 shadow-sm border border-slate-100">
          <FormRenderer 
            meta={STORE_FORM_META}
            initialData={storeData} // Data dari API dimasukkan ke sini
            onSubmit={(data) => handleSubmit(data)}
            isLoading={updateMutation.isPending}
            submitLabel="Perbarui Informasi"
          />
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
          <h4 className="text-blue-800 font-bold mb-1">Tips Kelola Toko</h4>
          <p className="text-blue-600 text-sm">
            Perubahan pada nama toko atau alamat akan langsung berdampak pada cetakan struk transaksi terbaru.
          </p>
        </div>
      </div>
    </div>
  );
}