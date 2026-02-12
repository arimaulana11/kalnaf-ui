import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffs, createStaff, updateStaff, deleteStaff } from '../services/staff.service';
import toast from 'react-hot-toast';

// Tambahkan parameter page dengan default value 1
export const useStaff = (page: number = 1) => {
  const queryClient = useQueryClient();

  // 1. Query untuk mengambil data
  const staffQuery = useQuery({
    // Tambahkan 'page' ke queryKey agar React Query re-fetch saat halaman berubah
    queryKey: ['staff', page], 
    queryFn: () => getStaffs(page),
  });

  // 2. Mutation untuk Create
  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      // Invalidate semua query yang berawalan ['staff']
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil ditambahkan');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal menambahkan staff';
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  });

  // 3. Mutation untuk Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil diperbarui');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Gagal memperbarui staff';
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  });

  // 4. Mutation untuk Delete
  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff berhasil dihapus');
    },
    onError: () => toast.error('Gagal menghapus staff')
  });

  return { staffQuery, createMutation, updateMutation, deleteMutation };
};