'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { startSync } from '@/lib/sync-manager'; // Kita akan buat file ini besok

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // Penting untuk Offline: Jangan refetch saat internet mati
        networkMode: 'offlineFirst', 
      },
    },
  }));

  useEffect(() => {
    // 1. Jalankan sinkronisasi saat aplikasi pertama kali dibuka
    startSync();

    // 2. Jalankan sinkronisasi setiap kali status internet kembali Online
    const handleOnline = () => {
      console.log('Koneksi kembali! Memulai sinkronisasi...');
      startSync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}