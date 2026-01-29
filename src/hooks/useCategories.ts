// hooks/useCategories.ts
import { Category } from '@/types/category';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            if (!res.status) throw new Error('Gagal mengambil kategori');
            return res.data.data.data as Category[];
            //   const response = await fetch('/categories');
            //   if (!response.ok) throw new Error('Gagal mengambil kategori');
            //   return response.json(); // Pastikan formatnya array: [{id: 1, name: '...'}, ...]
        },
    });
};