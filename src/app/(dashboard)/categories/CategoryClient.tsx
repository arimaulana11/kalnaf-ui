'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Category, CategoryPayload } from '@/types/category';
import { CategoryTable } from '@/components/categories/CategoryTable';
import { CategoryModal } from '@/components/categories/CategoryModal';
import { Plus, Loader2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CategoryClient() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. READ: Fetch Data
  const { data: categories, isLoading, isRefetching } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data.data as Category[];
    }
  });

  // 2. CREATE & UPDATE Mutation
  const saveCategory = useMutation({
    mutationFn: async (payload: CategoryPayload) => {
      if (selectedCategory) {
        // Update jika ada category yang dipilih
        return api.patch(`/categories/${selectedCategory.id}`, payload);
      }
      // Create jika baru
      return api.post('/categories', payload);
    },
    onSuccess: () => {
      toast.success(selectedCategory ? 'Kategori diperbarui' : 'Kategori berhasil dibuat');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  // 3. DELETE Mutation
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Kategori dihapus');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Kategori Produk</h1>
          <p className="text-slate-500 font-medium">Kelola klasifikasi inventaris Anda</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Tambah Kategori
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cari nama kategori..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
          className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
        >
          <RefreshCw size={20} className={isRefetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Kategori...</p>
        </div>
      ) : (
        <CategoryTable 
          data={filteredCategories || []} 
          onEdit={handleEdit} 
          onDelete={(id) => {
            if(confirm('Hapus kategori ini?')) deleteCategory.mutate(id);
          }} 
        />
      )}

      {/* Modal Form */}
      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={(payload) => saveCategory.mutate(payload)}
        initialData={selectedCategory}
        isLoading={saveCategory.isPending}
      />
    </div>
  );
}