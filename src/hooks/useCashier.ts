import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createTransaction } from '@/services/cashier.service';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from './useDebounce';

export const useCashier = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const productsQuery = useQuery({
    // Query key menyertakan debouncedSearch agar cache dipisahkan per kata kunci
    queryKey: ['cashier-products', debouncedSearch],
    // TypeScript tidak akan error lagi setelah langkah #1 dilakukan
    queryFn: () => getProducts(debouncedSearch),
    placeholderData: (previousData) => previousData,
    // Tambahkan staleTime agar tidak re-fetch terlalu sering saat berpindah tab
    staleTime: 1000 * 60 * 5, 
  });

  const checkoutMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashier-products'] });
      toast.success('Transaksi Berhasil Disimpan');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Gagal memproses transaksi';
      toast.error(msg);
    }
  });

  return { 
    productsQuery, 
    checkoutMutation, 
    search, 
    setSearch 
  };
};