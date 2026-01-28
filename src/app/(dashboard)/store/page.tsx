'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { StoreCard } from '@/components/store/StoreCard';
import { Plus, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StoreListPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      // API ini akan mengirim header Authorization otomatis lewat axios interceptor
      const res = await api.get('/stores');
      return res.data.data; 
    },
  });

  const stores = data?.data || [];

  const handleSelectStore = (store: any) => {
    // Kita simpan ID atau Info toko hanya untuk kebutuhan UI Dashboard
    // setStoreId(store.id); 
    // router.push('/dashboard/overview'); 
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pilih Cabang</h1>
          <p className="text-slate-500 text-lg font-medium">Selamat datang kembali! Kelola operasional toko Anda.</p>
        </div>
        
        <button 
          onClick={() => router.push('/dashboard/stores/create')}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100"
        >
          <Plus size={22} strokeWidth={3} />
          Tambah Cabang
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 w-full bg-white border border-slate-100 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store: any) => (
            <StoreCard
              key={store.id}
              name={store.name}
              address={store.address}
              phone={store.phone || 'N/A'}
              logo={store.logo_url}
              status={store.is_active}
              onSelect={() => handleSelectStore(store)}
            />
          ))}
          
          {stores.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <LayoutGrid size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Toko Tidak Ditemukan</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">Anda belum memiliki toko terdaftar di akun ini.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}